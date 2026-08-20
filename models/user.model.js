import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({

    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        require: true,
    },
    role: {
        type: String,
    }

},
    { timestamp: true }
)

export const User = mongoose.model("User", userSchema)    