import { MongoClient } from "npm:mongodb@5.6.0";

console.log(Deno.env.get("MONGO_URI"))
const MONGO_CONNECTION_STRING = Deno.env.get("MONGO_URI") || null;
const DB_NAME = Deno.env.get("DB_NAME") || null;

if (!(MONGO_CONNECTION_STRING && DB_NAME)) {
    console.error("Mongo envroment variables not set");
    Deno.exit(1);
}

const client = new MongoClient(MONGO_CONNECTION_STRING);

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  Deno.exit(1);
}

const db = client.db(DB_NAME);
const usersCollection = db.collection("users");
const trainingCollection = db.collection("training");

export { usersCollection, trainingCollection };