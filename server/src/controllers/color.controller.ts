import { Request, Response } from "express";
import { User } from "../models/user";
import { Color } from "../models/colors";
import { Like } from "../models/Like";
import mongoose from "mongoose";
import getDateFilter from "../lib/dateFillter";


export const addColor = async (req: Request, res: Response) => {
    try {
        const { colorHex, tags } = req.body;

        // Validate Request Data
        // if (!username || !Array.isArray(colorHex) || colorHex.length === 0) {
        //     return res.status(400).json({
        //         message: "Invalid request: Username and colorHex are required",
        //     });
        // }

        // Validate tags
        const validTags =
            Array.isArray(tags) && tags.every((t) => typeof t === "string")
                ? tags.map((t) => t.trim().toLowerCase())
                : [];

        // Check if the user already exists
        // let existingUser = await User.findOne({ username });

        // if (!existingUser) {
        //     existingUser = await User.create({ username });
        // }

        // Save colors and link to user
        const newColors = await Color.create({
            // userId: existingUser._id, // Link the color to the user
            colors: colorHex,
            tags: validTags,
        });

        return res.status(201).json({
            message: "Colors added successfully",
            // user: existingUser,
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
        const userToken = (req.headers['user-token'] as string) || (req.query.userToken as string);

        console.log("🔍 Received userToken:", userToken); // Debug log
        console.log("📋 Headers:", req.headers); // Debug log

        let userLikes = new Set<string>();
        if (userToken) {
            const likes = await Like.find({ userToken }, "paletteId").lean();
            console.log("💖 Found likes:", likes); // Debug log
            userLikes = new Set(
                likes.map(like => like.paletteId.toString())
            );
            console.log("📦 Liked palette IDs Set:", Array.from(userLikes));
        }


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
        const userIds = [...new Set(colorPalettes.map(palette => palette.userId ? palette.userId.toString() : null).filter(Boolean)),];
        const users = userIds.length ? await User.find({ _id: { $in: userIds } }, "username").lean() : [];
        const userMap = Object.fromEntries(users.map(user => [user._id.toString(), user.username]));

        // Format response with like status
        const formattedPalettes = colorPalettes.map(palette => {
            const paletteIdString = palette._id?.toString?.() || "";
            const isLiked = userLikes.has(paletteIdString);

            console.log(`🎨 Palette ${paletteIdString}: isLiked = ${isLiked}`); // Debug log
            const username = palette.userId
                ? userMap[palette.userId.toString()] || "Unknown User"
                : "Unknown User";

            return {
                id: palette._id,
                username,
                colors: palette.colors,
                createdAt: palette.createdAt,
                likes: palette.likes,
                isLiked
            };
        });

        return res.status(200).json({
            message: "Color palettes retrieved successfully",
            count: formattedPalettes.length,
            totalPalettes,
            currentPage: page,
            totalPages: Math.ceil(totalPalettes / limit),
            hasMore: page < Math.ceil(totalPalettes / limit),
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
        const userToken = req.query.userToken as string || req.headers['user-token'] as string;

        // Find the color palette by ID
        const palette = await Color.findById(id).lean();
        if (!palette) {
            return res.status(404).json({ message: "Color palette not found" });
        }

        const isLiked = userToken ? !!(await Like.findOne({ paletteId: id, userToken })) : false;

        // Return the found palette
        return res.status(200).json({
            ...palette,
            id: palette._id,
            isLiked
        });
    } catch (error) {
        console.error("Error fetching color palette:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// Controller for get liked palletes by user
export const likedColorPalettes = async (req: Request, res: Response) => {
    try {
        const userToken = req.query.userToken as string || req.headers['user-token'] as string;

        if (!userToken) {
            return res.status(404).json({ message: "User Token not found" });
        }

        // Find all likes for this user
        const likes = await Like.find({userToken}).lean();

        if (!likes || likes.length === 0) {
            return res.status(200).json({ palettes: [] });
        }

        // Get all palettes by IDs
        const paletteIds = likes.map(like => like.paletteId);

        // Find all palettes by those IDs
        const palettes = await Color.find({ _id: { $in: paletteIds } }).lean();

        // Fetch usernames in a single query
        const userIds = [...new Set(palettes.map(palette => palette.userId.toString()))];
        const users = await User.find({ _id: { $in: userIds } }, "username").lean();
        const userMap = Object.fromEntries(users.map(user => [user._id.toString(), user.username]));

        // Format response with isLiked: true for all palettes
        const formattedPalettes = palettes.map(palette => ({
            id: palette._id,
            username: userMap[palette.userId.toString()] || "Unknown User",
            colors: palette.colors,
            createdAt: palette.createdAt,
            likes: palette.likes,
            isLiked: true // IMPORTANT: All palettes in this list are liked
        }));

        return res.status(200).json({
            palettes: formattedPalettes
        })
    } catch (error) {
        
    }
}


// Controller for liking a color palette
// Controller for liking a color palette
export const likeColorPalette = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const userToken = req.query.userToken as string || req.headers['user-token'] as string;

        console.log("❤️ Like request - Palette ID:", id, "UserToken:", userToken); // Debug log

        if (!userToken) {
            await session.abortTransaction();
            return res.status(400).json({ message: "User token is required" });
        }

        const palette = await Color.findById(id).session(session);
        if (!palette) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Palette not found" });
        }

        const existingLike = await Like.findOne({ paletteId: id, userToken }).session(session);
        console.log("🔍 Existing like found:", existingLike); // Debug log

        if (existingLike) {
            // unlike
            await Like.deleteOne({ _id: existingLike._id }, { session });
            palette.likes = Math.max(0, palette.likes - 1);
            await palette.save({ session });
            await session.commitTransaction();

            console.log("👎 Unliked - New count:", palette.likes); // Debug log

            return res.json({
                message: "Unliked",
                isLiked: false,
                likes: palette.likes,
            });
        } else {
            // like
            await Like.create([{ paletteId: id, userToken }], { session });
            console.log("✅ Created new like:", Like); // Debug log

            palette.likes += 1;
            await palette.save({ session });
            await session.commitTransaction();

            console.log("👍 Liked - New count:", palette.likes); // Debug log

            return res.json({
                message: "Liked",
                isLiked: true,
                likes: palette.likes,
            });
        }
    } catch (error) {
        await session.abortTransaction();
        console.error("Error updating like status:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    } finally {
        session.endSession();
    }
};

// Controller to filtering data for Popular according to month, year & all time
export const getColorPalettesByPopular = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
        const skip = (page - 1) * limit;

        // Get filter type from query params
        const filterType = (req.query.filter as string) || 'all'; // 'month', 'year' or 'all'

        // Get userToken from query params or headers
        const userToken = (req.headers['user-token'] as string) || (req.query.userToken as string);

        // Get user likes (same as before)
        let userLikes = new Set<string>();
        if (userToken) {
            const likes = await Like.find({ userToken }, "paletteId").lean();
            userLikes = new Set(
                likes.map(like => like.paletteId.toString()) 
            );
        }

        // Build date filter
        const dateFilter = getDateFilter(filterType);

        // Fetch color palettes
        const [totalPalettes, colorPalettes] = await Promise.all([
            Color.countDocuments(dateFilter),
            Color.find(dateFilter, "UserId colors likes createdAt")
                .sort({ likes: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        // Fetch usernames in a single query
        const userIds = [...new Set(colorPalettes.map(palette => palette.userId ? palette.userId.toString() : null).filter(Boolean)),];
        const users = userIds.length ? await User.find({ _id: { $in: userIds } }, "username").lean() : [];
        const userMap = Object.fromEntries(users.map(user => [user._id.toString(), user.username]));

        // Format response with like status
        const formattedPalettes = colorPalettes.map(palette => {
            const paletteIdString = palette._id?.toString?.() || "";
            const isLiked = userLikes.has(paletteIdString);

            const username = palette.userId
                ? userMap[palette.userId.toString()] || "Unknown User"
                : "Unknown User";

            return {
                id: palette._id,
                username,
                colors: palette.colors,
                createdAt: palette.createdAt,
                likes: palette.likes,
                isLiked
            };
        })

        return res.status(200).json({
            messsage: "Color palettes retrieved successfully",
            count: formattedPalettes.length,
            totalPalettes,
            currentPage: page,
            totalPages: Math.ceil(totalPalettes / limit),
            hasMore: page < Math.ceil(totalPalettes / limit),
            palettes: formattedPalettes,
        });

    } catch (error: unknown) {
        console.error("Error in getColorPalettesByPopular:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};



