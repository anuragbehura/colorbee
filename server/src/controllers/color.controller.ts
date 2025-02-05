import { Request, Response } from "express";
import { User } from "../models/user";
import { Color } from "../models/colors";


export const addColor = async (req: Request, res: Response) => {
    try {
        const { username, colorHex } = req.body;

        // Validate Request Data
        if (!username || !Array.isArray(colorHex) || colorHex.length === 0) {
            return res.status(400).json({
                message: "Invalid request: Username and colorHex are required",
            });
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ username });

        if (!existingUser) {
            existingUser = await User.create({ username });
        }

        // Save colors and link to user
        const newColors = await Color.create({
            userId: existingUser._id, // Link the color to the user
            colors: colorHex,
        });

        return res.status(201).json({
            message: "Colors added successfully",
            user: existingUser,
            colors: newColors,
        });

    } catch (error) {
        console.error("Error in addColor:", error);
        return res.status(500).json({
            message: "Internal server error, unable to add color",
        });
    }
};


export const getAllColorPalettes = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
        const skip = (page - 1) * limit;

        // Fetch color palettes
        const [totalPalettes, colorPalettes] = await Promise.all([
            Color.countDocuments(),
            Color.find({}, "userId colors likes createdAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        // Fetch usernames in a single query
        const userIds = [...new Set(colorPalettes.map(palette => palette.userId.toString()))];
        const users = await User.find({ _id: { $in: userIds } }, "username").lean();
        const userMap = Object.fromEntries(users.map(user => [user._id.toString(), user.username]));

        // Format response
        const formattedPalettes = colorPalettes.map(palette => ({
            id: palette._id,
            username: userMap[palette.userId.toString()] || "Unknown User",
            colors: palette.colors,
            createdAt: palette.createdAt,
            likes: palette.likes,
        }));

        return res.status(200).json({
            message: "Color palettes retrieved successfully",
            count: formattedPalettes.length,
            totalPalettes,
            currentPage: page,
            totalPages: Math.ceil(totalPalettes / limit),
            palettes: formattedPalettes,
        });
    } catch (error: unknown) {
        console.error("Error in getAllColorPalettes:", error);
        return res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message: "Unknow error" });
    }
};
