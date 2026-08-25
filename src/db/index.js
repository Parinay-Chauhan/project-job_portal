import mongoose from "mongoose";
import { DB_NAME } from '../constant.js'

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`MongoDB connect successfully on port ${process.env.PORT}`);

    } catch (error) {
        console.log("MongoDB connection error", error);
        throw error;
        // process.exit(1)

    }
}

export default connectDB;