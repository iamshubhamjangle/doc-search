import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";

// Types for better code organization
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
const OPENAI_MODEL = "text-embedding-ada-002";

/**
 * Processes PDF file and extracts text content
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

    console.log(`Successfully processed PDF with ${docs.length} pages`);
    return docs;
  } catch (error) {
    console.error("PDF processing error:", error);
    throw new Error(
      `PDF processing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Splits documents into smaller chunks for better processing
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

    // Add chunk numbers to metadata
    const docsWithChunkNumbers = splitDocs.map((doc, index) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        chunk: index + 1,
      },
    }));

    console.log(`Split into ${docsWithChunkNumbers.length} chunks`);
    return docsWithChunkNumbers;
  } catch (error) {
    console.error("Document splitting error:", error);
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
      modelName: OPENAI_MODEL,
    });

    const vectors = await embeddings.embedDocuments(
      docs.map((doc) => doc.pageContent)
    );

    console.log(`Generated embeddings for ${vectors.length} chunks`);
    return { chunks: docs, vectors };
  } catch (error) {
    console.error("Embedding generation error:", error);
    throw new Error(
      `Embedding generation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Main API route handler
 */
export async function POST(req: NextRequest) {
  console.log("Document processing endpoint hit");

  try {
    // Step 1: Get and validate file
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new NextResponse("File not found", { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return new NextResponse("Only PDF files are supported", { status: 400 });
    }

    // Step 2: Process PDF
    const docs = await processPdfFile(file);

    // Step 3: Split documents
    const splitDocs = await splitDocuments(docs);

    // Step 4: Generate embeddings
    const { chunks, vectors } = await generateEmbeddings(splitDocs);

    // Step 5: Prepare response
    const response = {
      success: true,
      filename: file.name,
      stats: {
        originalPages: docs.length,
        chunks: chunks.length,
        vectorDimensions: vectors[0]?.length ?? 0,
        averageChunkLength: Math.round(
          chunks.reduce((acc, chunk) => acc + chunk.pageContent.length, 0) /
            chunks.length
        ),
      },
      chunks: chunks.map((chunk, i) => ({
        id: i + 1,
        pageNumber: chunk.metadata.page,
        chunkNumber: chunk.metadata.chunk,
        contentPreview: chunk.pageContent.substring(0, 100) + "...",
        vectorLength: vectors[i]?.length,
      })),
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
