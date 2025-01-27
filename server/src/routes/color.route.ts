import express, { Request, Response } from "express";
import { addColor } from "../controllers/color.controller";

export const router = express.Router();

router.post("/add-color", async (req: Request, res: Response) => {
    await addColor(req, res);
});

export default router;


