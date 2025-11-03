import express, { Request, Response } from "express";
import { addColor, getAllColorPalettes, getColorPaletteById, getColorPalettesByPopular, likeColorPalette, likedColorPalettes } from "../controllers/color.controller";

export const router = express.Router();

router.post("/add-color", async (req: Request, res: Response) => {
    await addColor(req, res);
});

router.get("/get-all-colors", async (req: Request, res: Response) => {
    await getAllColorPalettes(req, res);
});

router.get("/get-popular-colors", async (req: Request, res: Response) => {
    await getColorPalettesByPopular(req, res);
});

router.get("/liked-color-palettes", async (req: Request, res: Response) => {
    await likedColorPalettes(req, res);
})

router.get("/:id", async (req: Request, res: Response) => {
    await getColorPaletteById(req, res);
});

router.post("/:id/like", async (req: Request, res: Response) => {
    await likeColorPalette(req, res);
});

export default router;


