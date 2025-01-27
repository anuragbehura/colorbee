import express from "express";
import { config } from "dotenv";
import connectDB from "./db/mongoDB";

config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: false }));

connectDB();
app.get('/', (req, res) => {
    res.send(`Server is up and running on ${port}`)
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
