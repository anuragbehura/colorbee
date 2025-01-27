import mongoose, { Schema } from "mongoose";

const colorSchema = new mongoose.Schema({
    username: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    colors: [String]
},
{
    timestamps: true,
}
)

export const color = mongoose.model('Color', colorSchema);
