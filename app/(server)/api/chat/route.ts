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
}

// 1. Generate embedding & Search Vector Store
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
    k: 2,
    searchType: "similarity",
  });

  const pineconeResult = await retriever.invoke(query);

  return pineconeResult;
}

// 2 Pass the result to openAI for a curated response.
const generateResponseFromResults = async (
  context: DocumentInterface<Record<string, any>>[],
  query: string
) => {
  const llm = new ChatOpenAI({
    model: process.env.OPEN_AI_CHAT_MODEL,
    temperature: 0,
  });

  const customTemplate = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.

{context}

Question: {question}

Helpful Answer:`;

  const customRagPrompt = PromptTemplate.fromTemplate(customTemplate);

  const customRagChain = await createStuffDocumentsChain({
    llm: llm,
    prompt: customRagPrompt,
    outputParser: new StringOutputParser(),
  });

  const result = await customRagChain.invoke({
    question: query,
    context,
  });

  return result;
};

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

    // 1. Generate embedding & Search Vector Store
    const topMatchingResults = await getTopKResultsFromPinecone(
      userId,
      fileIds,
      query
    );

    // 2. Pass the result to openAI for a curated response.
    const answer = await generateResponseFromResults(topMatchingResults, query);

    // 4. Prepare and return response
    const response: ChatResponse = {
      answer,
      source: topMatchingResults.map((item) => ({
        fileId: item.metadata.fileId,
        pageNumber: item.metadata.pageNumber,
      })),
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
