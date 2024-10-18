import { Pinecone } from "@pinecone-database/pinecone";

const initPinecone = async () => {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("Pinecone DB API key missing");
  }

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  return pinecone;
};

// Function to get an index by name
const getPineconeIndex = async (indexName: string) => {
  if (!indexName) {
    throw new Error("Pinecone DB Index name is missing");
  }

  const pineconeClient = await initPinecone();
  return pineconeClient.Index(indexName);
};

const getPineconeDevIndex = () => getPineconeIndex(process.env.PINECONE_INDEX!);

export { getPineconeDevIndex };
