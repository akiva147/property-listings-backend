import { MongoClient, Db } from "mongodb";
import { validateEnvs } from "./env.util";

let db: Db;

export const connectToDatabase = async () => {
  const { DB_CONNECTION, DB_NAME } = validateEnvs();
  const client = new MongoClient(DB_CONNECTION); // Replace with your MongoDB URI
  await client.connect();
  db = client.db(DB_NAME);
  console.log("Connected to MongoDB");
};

export const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
};
