import { Request, Response } from "express";
import { User } from "../models/user";
import { Color } from "../models/colors";
import { Like } from "../models/Like";


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

        // Get userToken from query params or headers
        const userToken = req.query.userToken as string || req.headers['user-token'] as string;

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

        // Format response with like status
        const formattedPalettes = await Promise.all(colorPalettes.map(async palette => {
            const isLiked = userToken ?
                !!(await Like.findOne({ paletteId: palette._id, userToken })) :
                false;

            return {
                id: palette._id,
                username: userMap[palette.userId.toString()] || "Unknown User",
                colors: palette.colors,
                createdAt: palette.createdAt,
                likes: palette.likes,
                isLiked
            };
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
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};


// Controller function to get a single color palette by ID
export const getColorPaletteById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;  // Get palette ID from the request params

        // Find the color palette by ID
        const palette = await Color.findById(id);
        if (!palette) {
            return res.status(404).json({ message: "Color palette not found" });
        }

        // Return the found palette
        return res.status(200).json(palette);
    } catch (error) {
        console.error("Error fetching color palette:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};


// Controller for liking a color palette
export const likeColorPalette = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userToken } = req.body;

        const palette = await Color.findById(id);
        if (!palette) {
            return res.status(404).json({ message: "Color palette not found" });
        }

        const existingLike = await Like.findOne({
            paletteId: id,
            userToken
        });

        if (!existingLike) {
            // Create new like
            await Like.create({
                paletteId: id,
                userToken,
                createdAt: new Date()
            });
            palette.likes += 1;
        } else {
            // Remove existing like
            await Like.findOneAndDelete({
                paletteId: id,
                userToken
            });
            palette.likes = Math.max(0, palette.likes - 1);
        }

        await palette.save();

        return res.status(200).json({
            message: "Color palette like status updated",
            id: palette._id,
            likes: palette.likes,
            isLiked: !existingLike
        });

    } catch (error) {
        console.error("Error updating like status:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};



