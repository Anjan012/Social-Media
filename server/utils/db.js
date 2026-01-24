import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10, // keep the connection pool size to 10 
        });
        console.log(`MongoDB connected ${conn.connection.host}`.cyan);
    } catch (error) {
        console.log(`MongoDb connection error: ${error.message}`.red);
        process.exit(1);
        // note: her we also implement a setTimeout to avoid infinite retries, it is also good for production apps
    }
}

export default connectDB;