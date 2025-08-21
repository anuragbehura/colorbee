import express from "express";
import cors from "cors";
import colorRoutes from "./routes/color.route"

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    optionsSuccessStatus: 204, // Some legacy browser choke on 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));


app.use("/api/v1/colors", colorRoutes);

export {app};