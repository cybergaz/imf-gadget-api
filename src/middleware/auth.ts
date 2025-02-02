import "dotenv/config";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getEmail } from "../actions/actions";

const secretKey = process.env.JWT_SECRET || 'cybergaz';

// Define the shape of the JWT payload
interface JwtPayload {
    id?: number;
    email?: string;
}

const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'Unauthorized: No token provided, please provide your JWT token in the header, login again to regenerate /auth/login' });
        return
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: Token not found in the header' });
        return
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey) as JwtPayload;

        // Check if the user exists in the database
        const userEmail = await getEmail(decoded.id!);
        if (userEmail.success === false && userEmail.data != decoded.email) {
            res.status(401).json({ message: 'Unauthorized: User not found' });
            return
        }

        // Attach the user's email or ID to the request object for use in subsequent middleware/route handlers
        // req.user = { id: decoded.id, email: decoded.email };

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(403).json({ message: 'Unauthorized: Token expired, please re-login' });
            return
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: 'Unauthorized: Invalid token, please re-login' });
            return
        } else {
            console.error('Error verifying token:', err);
            res.status(500).json({ message: 'Internal server error' });
            return
        }
    }
};

export { authenticateJWT };
