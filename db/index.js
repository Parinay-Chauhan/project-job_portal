import mongoose from "mongoose";
import { DB_NAME } from '../src/constant.js'

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`MongoDB connect successfully on port ${PORT}`);

    } catch (error) {
        console.log("MongoDB connection error", error);

    }
}

export default connectDB;