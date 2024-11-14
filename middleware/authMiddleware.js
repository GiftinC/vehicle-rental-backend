import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    // Extract token from authorization header
    const token = req.headers.authorization?.split(" ")[1];
   // console.log("Token received in middleware:", token);

    if (!token) {
        console.error("Token is missing");
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token and attach userId to the request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       // console.log("Decoded token:", decoded);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({ message: "Invalid or Expired Token", error: error.message });
    }
};

export default authenticateUser;
