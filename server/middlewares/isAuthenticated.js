import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookie.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    req.id = decodeToken.userId;

    next();

  } catch (error) {
    console.log(error);
  }
};


export default isAuthenticated;