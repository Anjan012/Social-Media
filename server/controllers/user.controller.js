import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    try {

        const { username, email, password} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields",
                sucess: false
            });
        };

        // Check if user already exists
        const existUser = await User.findOne({
            $or: [
                { username},
                { email}
            ]
        });

        if(existUser) {
            return res.status(409).json({
                message: "User with this username or email already exists",
                success: false,
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            email,
            password: hashedPassword,
        }

        const createdUser = await User.create(newUser, { new: true });

        return res.status(201).json({
            message: "User created successfully",
            success: true,
            createdUser,
        });

    } catch (error) {
        console.error("Error in signUp controller:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}