import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import path from "path";
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
console.log("Cloudinary configured with:", process.env.CLOUD_NAME ? "OK" : "Missing keys");

const app = express();


// const corsOptions = {
//     // origin: "http://localhost:5173", // allow requests from this origin
//     origin: ["https://social-media-frontend-tp54.onrender.com", "http://localhost:5173"],
//     // optionsSuccessStatus: 200,
//     credentials: true
// };
// app.use(cors(corsOptions));


// Put this in your index.js (replace the old corsOptions)
const allowedOrigins = [
    "http://localhost:5173",                          // ← For local development
    "http://localhost:3000",                          // ← Just in case
    "https://social-media-frontend-tp54.onrender.com" // ← Your deployed frontend
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,          
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to the Express server",
        success: true
    })
});

app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});


app.use("/api/v1/", userRoutes);
app.use("/api/v1", postRoutes); 



connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running at port : ${PORT}`);
    })
})
.catch((err) => {
    console.error("Failed to start the server due to DB connection issue", err);
});


app.use(errorHandler);
