import { NextResponse } from "next/server";
import { getPineconeDevIndex } from "@/app/_lib/pinecone";
import { serverAuth } from "@/app/_lib/serverAuth";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatOpenAI } from "@langchain/openai";
import { DocumentInterface } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import prisma from "@/app/_lib/db";

// Types
interface ChatRequest {
  query: string;
  fileIds?: string[];
}

interface ChatResponse {
  answer: string;
  source?: {
    fileId: string;
    pageNumber: Number;
  }[];
  debug?: {
    prompt: string;
    context: string;
    rawResults: any;
  };
}

// Debug helper function
const debugLog = (message: string, data: any) => {
  console.log("\n=== DEBUG ===");
  console.log(message);
  console.log(JSON.stringify(data, null, 2));
  console.log("============\n");
};

async function getTopKResultsFromPinecone(
  userId: string,
  fileIds: string[],
  query: string
) {
  const pineconeIndex = await getPineconeDevIndex();
  const embeddings = new OpenAIEmbeddings({
    model: process.env.OPEN_AI_TEXT_EMBEDDING_MODEL,
  });

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });

  const retriever = vectorStore.asRetriever({
    filter: {
      userId,
      fileId: fileIds[0],
    },
    k: 5,
    searchType: "similarity",
  });

  const pineconeResult = await retriever.invoke(query);

  // Debug log for Pinecone results
  // debugLog("Pinecone Search Results:", {
  //   query,
  //   resultCount: pineconeResult.length,
  //   results: pineconeResult.map((doc) => ({
  //     content: doc.pageContent.substring(0, 100) + "...",
  //     metadata: doc.metadata,
  //     score: doc.metadata.score,
  //   })),
  // });

  return pineconeResult;
}

const generateResponseFromResults = async (
  context: DocumentInterface<Record<string, any>>[],
  query: string
) => {
  const llm = new ChatOpenAI({
    model: process.env.OPEN_AI_CHAT_MODEL,
    temperature: 0.7,
  });

  const customTemplate = `
  Use the following Context to answer the question. If there is no relevant information in the context, respond with "I don't have the information to answer that."
  
  Context: {context}
  
  Question: {question}
  `;

  const customRagPrompt = PromptTemplate.fromTemplate(customTemplate);

  const customRagChain = await createStuffDocumentsChain({
    llm: llm,
    prompt: customRagPrompt,
    outputParser: new StringOutputParser(),
  });

  // Generate the actual prompt that will be sent to OpenAI
  const promptValue = await customRagPrompt.format({
    context: context
      .map((doc) => {
        console.log("doc", doc);
        return doc?.pageContent;
      })
      .join("\n\n"),
    question: query,
  });

  // Debug log for prompt and context
  debugLog("OpenAI Prompt Details:", {
    fullPrompt: promptValue,
    contextLength: context.length,
    query,
  });

  const result = await customRagChain.invoke({
    question: query,
    context,
  });

  return {
    answer: result,
    debugInfo: {
      prompt: promptValue,
      context: context.map((doc) => doc.pageContent).join("\n\n"),
    },
  };
};

export async function POST(req: Request) {
  try {
    const session = await serverAuth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const userId = session.user.id;

    const body: ChatRequest = await req.json();
    const { query, fileIds } = body;

    if (!query || !userId || !fileIds || fileIds.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
    if (userProfile.queryLimit <= 0) {
      return NextResponse.json(
        { message: "You have exhausted your query limit" },
        { status: 403 }
      );
    }

    // 1. Generate embedding & Search Vector Store
    const topMatchingResults = await getTopKResultsFromPinecone(
      userId,
      fileIds,
      query
    );

    // 2. Pass the result to openAI for a curated response
    const { answer, debugInfo } = await generateResponseFromResults(
      topMatchingResults,
      query
    );

    // 3. Prepare and return response
    const response: ChatResponse = {
      answer,
      source: topMatchingResults.map((item) => ({
        fileId: item.metadata.fileId,
        pageNumber: item.metadata.pageNumber,
      })),
      debug: {
        prompt: debugInfo.prompt,
        context: debugInfo.context,
        rawResults: topMatchingResults.map((doc) => ({
          content: doc.pageContent,
          metadata: doc.metadata,
        })),
      },
    };

    // Final debug log
    debugLog("Final Response:", {
      answer,
      sourceCount: response.source?.length,
    });

    // Step 8: Deduct the limit
    await prisma.userProfile.update({
      where: { userId },
      data: { queryLimit: userProfile.queryLimit - 1 },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      {
        error: `Failed to process chat request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
