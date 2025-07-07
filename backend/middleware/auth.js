import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(403).json({ message: 'Token is required for authentication.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key'); // Replace with your actual JWT secret key
        req.user = decoded; // Add the decoded user data to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export default authMiddleware;