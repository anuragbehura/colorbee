import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    colors: [{
        type: Schema.Types.ObjectId,
        ref: 'Color'
    }]
},
{
    timestamps: true,
}
)

export const user = mongoose.model('User', userSchema);
