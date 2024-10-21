import { OpenAIApi, Configuration } from "openai";
import { getPineconeDevIndex } from "./pinecone";

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to generate embeddings using OpenAI
async function generateEmbeddings(text: string) {
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data.data[0].embedding;
}

// Main query function
async function queryPinecone() {
  try {
    // Get Pinecone index
    const index = await getPineconeDevIndex();

    // Generate embeddings for the query
    const queryEmbedding = await generateEmbeddings("test");

    // Query Pinecone
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 1,
      includeMetadata: true,
    });

    console.log(
      "Direct Pinecone query result:",
      queryResponse.matches[0]?.metadata
    );
  } catch (error) {
    console.error("Error querying Pinecone:", error);
  }
}

// Execute the query
queryPinecone();
