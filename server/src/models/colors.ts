import mongoose, { Schema, Document, Model } from "mongoose";

// 🎨 Color Interface
interface IColor extends Document {
    userId: mongoose.Types.ObjectId;
    colors: string[];
    likes: number;
    createdAt: Date;
}

// 🎨 Color Schema
const colorSchema = new Schema<IColor>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true, // ✅ Ensures every color has a user
        },
        colors: {
            type: [String], // ✅ Ensures an array of hex colors
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        // createdAt: {
        //     type: Date
        // }
    },
    { timestamps: true }
);

// Export the model
export const Color: Model<IColor> = mongoose.model<IColor>("Color", colorSchema);
