import express from "express";
import cors from "cors";
import colorRoutes from "./routes/color.route";

const app = express();

const corsOptions = {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // allow both localhost and 127
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // include OPTIONS
    allowedHeaders: ["Content-Type", "Authorization", "user-token"], // allow custom headers
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use("/api/v1/colors", colorRoutes);

export { app };
export default app;