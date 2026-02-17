import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // jwt.verify() either: returns a decoded payload, or throws an error (which you already catch) no need to add (if(!decodeToken)) check 

    req.id = decodeToken.userId;
    // console.log("Auth middleware running");

    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or token expire",
      success: false
    })
  }
};


export default isAuthenticated;