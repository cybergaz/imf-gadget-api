import "dotenv/config"
import { Request, Response } from 'express';
import { db } from '../config/database';
import bcrypt from 'bcrypt';
import { users } from "../models/models";
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken';

const handleSignup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required in the body' });
        return
    }

    try {
        // Hash the password with a salt (bcrypt automatically generates and stores the salt)
        const saltRounds = 10; // Number of salt rounds (higher = more secure but slower)
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Store the user in the database
        await db.insert(users).values({ email, hashed_password: passwordHash });
        console.log('User registered successfully : ', email);
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const handleLogin = async (req: Request, res: Response) => {

    const { email, password } = req.body;
    // console.log(email, password);

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required in the body' });
        return
    }

    // Find the user in the database
    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length === 0) {
        res.status(401).json({ message: 'User not found' });
        return
    }

    try {
        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user[0].hashed_password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
            return
        }

        const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET! || "secret");
        res.status(200).json({ message: 'Login successful, copy your jwt for subsequent api calls', token: token });

    } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export { handleLogin, handleSignup }
