import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";

import prisma from "@/app/_lib/db";
import { serverAuth } from "@/app/_lib/serverAuth";
import { getPineconeDevIndex } from "@/app/_lib/pinecone";

interface ProcessedDocument {
  pageContent: string;
  metadata: {
    page?: number;
    chunk?: number;
    [key: string]: any;
  };
}

// Configuration constants
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

/**
 * Generates a unique filename with timestamp
 */
function generateUniqueFileName(originalName: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const uniqueId = uuidv4().slice(0, 8);
  const extension = originalName.split(".").pop();
  return `${originalName.split(".")[0]}-${timestamp}-${uniqueId}.${extension}`;
}
/**
 * Step 2: Processes PDF file and extracts text content
 */
async function processPdfFile(file: File): Promise<ProcessedDocument[]> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfBlob = new Blob([buffer], { type: "application/pdf" });

    const loader = new PDFLoader(pdfBlob);
    const docs = await loader.load();

    if (docs.length === 0) {
      throw new Error("No content found in PDF");
    }

    // Ensure each document has a page number in its metadata
    const docsWithPages = docs.map((doc, index) => ({
      ...doc,
      pageContent: doc.pageContent.trim(),
      metadata: {
        ...doc.metadata,
        page: doc.metadata?.loc?.pageNumber || -1,
      },
    }));

    console.log(`STEP 2: Successfully processed PDF with ${docs.length} pages`);
    return docsWithPages;
  } catch (error) {
    console.error("STEP 2: PDF processing error:", error);
    throw new Error(
      `PDF processing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Step 3: Splits documents into smaller chunks for better processing
 */
async function splitDocuments(
  docs: ProcessedDocument[]
): Promise<ProcessedDocument[]> {
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
      separators: ["\n\n", "\n", ".", "!", "?", ",", " ", ""],
    });

    const splitDocs = await textSplitter.splitDocuments(docs);

    const docsWithMetadata = splitDocs.map((doc, index) => {
      return {
        ...doc,
        metadata: {
          ...doc.metadata,
          chunk: index + 1,
          page: doc.metadata.page || -1,
          pageContent: doc.pageContent,
        },
      };
    });

    console.log(`Step 3: File is Split into ${docsWithMetadata.length} chunks`);
    return docsWithMetadata;
  } catch (error) {
    console.error("Step 3: Document splitting error:", error);
    throw new Error(
      `Document splitting failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
/**
 * Generates embeddings for document chunks
 */
async function generateEmbeddings(
  docs: ProcessedDocument[]
): Promise<{ chunks: ProcessedDocument[]; vectors: number[][] }> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPEN_AI_TEXT_EMBEDDING_MODEL,
    });

    const vectors = await embeddings.embedDocuments(
      docs.map((doc) => doc.pageContent)
    );

    console.log(`Step 4: Generated embeddings for ${vectors.length} chunks`);
    return { chunks: docs, vectors };
  } catch (error) {
    console.error("Step 4: Embedding generation error:", error);
    throw new Error(
      `Embedding generation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Chunks array into smaller arrays of specified size
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Stores vectors in Pinecone with metadata
 */
async function storeVectorsInPinecone(
  vectors: number[][],
  chunks: ProcessedDocument[],
  fileId: string,
  fileName: string,
  userId: string
): Promise<string[]> {
  try {
    const index = await getPineconeDevIndex();

    // Prepare vectors with metadata
    const records: PineconeRecord<RecordMetadata>[] = vectors.map(
      (vector, i) => ({
        id: `${fileId}-chunk-${i}`,
        values: vector,
        metadata: {
          fileId,
          fileName,
          pageNumber: chunks[i].metadata.page || 0,
          chunkNumber: chunks[i].metadata.chunk || i,
          userId,
          text: chunks[i].pageContent,
        },
      })
    );

    // Split records into batches (200 is recommended by Pinecone)
    const batches = chunkArray(records, 200);

    console.log(
      `Step 5: Preparing to upload ${records.length} vectors in ${batches.length} batches`
    );

    try {
      // Upload all batches in parallel
      await Promise.all(
        batches.map(async (batch, batchIndex) => {
          try {
            await index.upsert(batch);
            console.log(
              `Step 5: Completed batch ${batchIndex + 1}/${batches.length}`
            );
          } catch (error) {
            console.error(`Step 5: Error in batch ${batchIndex + 1}:`, error);
            throw error; // Re-throw to be caught by the outer try-catch
          }
        })
      );
    } catch (error) {
      console.error("Step 5: Error during parallel batch upload:", error);
      throw new Error("Failed to upload one or more batches to Pinecone");
    }

    console.log(
      `Step 5: Successfully stored ${records.length} vectors in Pinecone`
    );
    return records.map((record) => record.id);
  } catch (error) {
    console.error("Step 5: Pinecone storage error:", error);
    throw new Error(
      `Failed to store vectors: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Generates a summary of the document using GPT-4
 */
async function generateSummary(docs: ProcessedDocument[]): Promise<string> {
  try {
    // const openai = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY!,
    // });

    // // Combine first few chunks for summary
    // const textForSummary = docs
    //   .slice(0, 3)
    //   .map(doc => doc.pageContent)
    //   .join("\n");

    // const response = await openai.chat.completions.create({
    //   model: "gpt-4-turbo-preview",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a helpful assistant that creates concise document summaries.",
    //     },
    //     {
    //       role: "user",
    //       content: `Please provide a brief summary (2-3 sentences) of the following document:\n\n${textForSummary}`,
    //     },
    //   ],
    //   temperature: 0.5,
    //   max_tokens: 150,
    // });
    //
    // return response.choices[0]?.message?.content || "Summary not available";
    console.log("Step 6: File Summary Generation is disabled");

    return "Summary not available";
  } catch (error) {
    console.error("Step 6: Summary generation error:", error);
    return "Failed to generate summary";
  }
}

/**
 * Main API route handler
 */
export async function POST(req: NextRequest) {
  console.log("Document processing endpoint hit");

  try {
    const session = await serverAuth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const userId = session.user.id;

    // Step 1: Get and validate file
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new NextResponse("File not found", { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return new NextResponse("Only PDF files are supported", { status: 400 });
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 }
      );
    }

    // Step 2: Check file upload limit
    if (userProfile.fileUploadLimit <= 0) {
      return NextResponse.json(
        { message: "You have exhausted your file upload limit" },
        { status: 403 }
      );
    }

    // Check if file size exceeds 1 MB (1 MB = 1024 * 1024 bytes)
    const maxFileSize = 1 * 1024 * 1024; // 1 MB
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { message: "File size must not exceed 1 MB" },
        { status: 403 }
      );
    }

    // Generate unique filename
    const uniqueFileName = generateUniqueFileName(file.name);

    console.log(`STEP 1: File processing started for '${uniqueFileName}'`);

    // Step 1: Create initial database entry with status processing
    const fileEntry = await prisma.file.create({
      data: {
        fileName: uniqueFileName,
        originalName: file.name,
        fileSize: file.size,
        pageCount: 0,
        chunkCount: 0,
        status: "PROCESSING",
        userId,
      },
    });

    // Step 2: Process PDF
    const docs = await processPdfFile(file);

    // Step 3: Split documents
    const splitDocs = await splitDocuments(docs);

    // Step 4: Generate embeddings
    const { chunks, vectors } = await generateEmbeddings(splitDocs);

    // Step 5: Store vectors in Pinecone
    const vectorIds = await storeVectorsInPinecone(
      vectors,
      chunks,
      fileEntry.id,
      uniqueFileName,
      userId
    );

    // Step 6: Generate summary
    const summary = await generateSummary(docs);

    // Step 7: Update database entry
    const updatedFile = await prisma.file.update({
      where: { id: fileEntry.id },
      data: {
        pageCount: docs.length,
        chunkCount: chunks.length,
        status: "COMPLETED",
        vectorIds,
        summary,
      },
    });
    console.log(`Step 7: File processing completed for: ${uniqueFileName}`);

    // Step 8: Deduct the limit
    await prisma.userProfile.update({
      where: { userId },
      data: { fileUploadLimit: userProfile.fileUploadLimit - 1 },
    });

    // Step 8: Prepare response
    const response = {
      success: true,
      file: {
        id: updatedFile.id,
        fileName: updatedFile.fileName,
        originalName: updatedFile.originalName,
        summary,
        stats: {
          pageCount: updatedFile.pageCount,
          chunkCount: updatedFile.chunkCount,
          vectorCount: vectorIds.length,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Processing pipeline error:", error);
    return new NextResponse(
      `Document processing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await serverAuth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const userId = session.user.id;

    const searchParams = req.nextUrl.searchParams;
    const fileId = searchParams.get("id");

    if (!fileId) return new NextResponse("fileId is required", { status: 400 });

    const index = await getPineconeDevIndex();

    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
        userId,
      },
      select: {
        vectorIds: true,
      },
    });

    if (!file) return new NextResponse("Access Denied", { status: 401 });

    // Delete all vectors with matching fileId in metadata
    if (file.vectorIds.length > 0) await index.deleteMany(file.vectorIds);

    await prisma.file.delete({
      where: {
        id: fileId,
        userId,
      },
    });

    console.log(`Deleted all vectors for fileId: ${fileId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting vectors:", error);
    return new NextResponse(
      `Error deleting vectors: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}
