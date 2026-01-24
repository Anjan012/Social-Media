import express from 'express';

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to the Express server",
        success: true
    })
});

app.listen(PORT, () => {
    console.log(`Server is running at port : ${PORT}`);
});

