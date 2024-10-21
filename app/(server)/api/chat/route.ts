import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { NextResponse } from "next/server";
import { getPineconeDevIndex } from "@/app/_lib/pinecone";
import { serverAuth } from "@/app/_lib/serverAuth";

// Types
interface ChatRequest {
  query: string;
  fileIds?: string[];
}

interface ChatResponse {
  answer: string;
  relevantChunks?: {
    content: string;
    metadata: any;
  }[];
}

// Initialize Pinecone store and create retriever
async function initializePineconeRetriever(userId: string, fileIds?: string[]) {
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const index = await getPineconeDevIndex();

    // Create vector store with filter
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      filter: {
        userId,
        ...(fileIds && fileIds.length > 0 && { fileId: { $in: fileIds } }),
      },
    });

    // Create retriever with correct configuration
    const retriever = vectorStore.asRetriever({
      searchType: "similarity",
      k: 5,
      filter: {
        userId,
        ...(fileIds && fileIds.length > 0 && { fileId: { $in: fileIds } }),
      },
    });

    console.log("Initialized Pinecone retriever successfully");
    return retriever;
  } catch (error) {
    console.error("Error initializing Pinecone retriever:", error);
    throw new Error(
      `Failed to initialize retriever: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Generate response using ChatGPT and retriever
async function generateResponse(query: string, retriever: any): Promise<any> {
  try {
    const llm = new ChatOpenAI({
      modelName: process.env.OPEN_AI_CHAT_MODEL,
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an assistant for question-answering tasks. 
        Use the following pieces of retrieved context to answer the question. 
        If you don't know the answer, say that you don't know. 
        Use three sentences maximum and keep the answer concise.
        Always include the source page numbers in your response. Content: {context}`,
      ],
      ["human", "{input}"],
    ]);

    const questionAnswerChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });

    const ragChain = await createRetrievalChain({
      retriever,
      combineDocsChain: questionAnswerChain,
    });

    const results = await ragChain.invoke({
      input: query,
    });

    console.log("Generated response successfully");
    return results;
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error(
      `Failed to generate response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Main route handler
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

    // 1. Initialize Pinecone retriever
    const retriever = await initializePineconeRetriever(userId, fileIds);

    // 2. Generate response using ChatGPT and retriever
    const results = await generateResponse(query, retriever);

    // 3. Extract relevant chunks from the results
    const relevantChunks = results.sourceDocuments.map((doc: any) => ({
      content: doc.pageContent,
      metadata: {
        pageNumber: doc.metadata.pageNumber,
        fileName: doc.metadata.fileName,
      },
    }));

    // 4. Prepare and return response
    const response: ChatResponse = {
      answer: results.answer,
      relevantChunks,
    };

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
