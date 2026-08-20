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
    },
    role: {
    type: String,
    enum: ["candidate", "recruiter"],
    default: "candidate"
}

},
    { timestamps: true }
)

export const User = mongoose.model("User", userSchema)    