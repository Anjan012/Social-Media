import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();


const corsOptions = {
    origin: "http://localhost:5137", // allow requests from this origin
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to the Express server",
        success: true
    })
});

connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running at port : ${PORT}`);
    })
})
.catch((err) => {
    console.error("Failed to start the server due to DB connection issue", err);
});

