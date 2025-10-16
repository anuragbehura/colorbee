import mongoose, { Schema, Document, Model } from "mongoose";

// 🎨 Color Interface
interface IColor extends Document {
    userId: mongoose.Types.ObjectId;
    colors: string[];
    tags: string[];
    likes: number;
    isLiked: boolean;
    createdAt: Date;
}

// 🎨 Color Schema
const colorSchema = new Schema<IColor>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            // required: true, // ✅ Ensures every color has a user
        },
        colors: {
            type: [String], // ✅ Ensures an array of hex colors
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        tags: {
            type: [String],
            default: [], 
        },
    },
    { timestamps: true }
);

colorSchema.index({ tags: 1 })

// Export the model
export const Color: Model<IColor> = mongoose.model<IColor>("Color", colorSchema);
