import mongoose, { Schema, Document, Model } from "mongoose";

// 👤 User Interface
interface IUser extends Document {
    username: string;
    colors: mongoose.Types.ObjectId[];
}

// 👤 User Schema
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            // required: true, // ✅ Ensure username is required
            unique: true,
            trim: true,
        },
        colors: [
            {
                type: Schema.Types.ObjectId,
                ref: "Color", // ✅ Correct reference
            }
        ],
    },
    { timestamps: true }
);

// Export the model
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
