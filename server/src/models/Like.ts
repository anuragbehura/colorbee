import mongoose from 'mongoose';

interface ILike {
    paletteId: mongoose.Types.ObjectId;
    userToken: string;
    createdAt: Date;
}

const LikeSchema = new mongoose.Schema<ILike>({
    paletteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
        required: true
    },
    userToken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Remove the indexes option from schema definition
});

// Create the index separately
LikeSchema.index({ paletteId: 1, userToken: 1 }, { unique: true });

export const Like = mongoose.model<ILike>('Like', LikeSchema);