import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env file");
}

const client = new MongoClient(MONGO_URI);

export async function connectDB() {
    try {
        await client.connect();
        console.log("✅ MongoDB connected successfully!");
        return client.db("jobtrack");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
}
