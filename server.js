import express from "express"
import authRoutes from "authRoutes"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("./frontend/dist"))
app.use(express.urlencoded({extended: true}))

// mongodb setup
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);
client.connect();
const db = client.db("jobtrack");
console.log("Mongodb connected!");

// attach db to every req
app.use((req, res, next) => {
    req.db = db;
    next();
})

app.use("/api/auth", authRoutes);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
