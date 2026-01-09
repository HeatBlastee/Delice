import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnect from './utils/db';
import authRouter from './routes/auth.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import shopRouter from './routes/shop.route';
import itemRouter from './routes/item.route';
import userRouter from './routes/user.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Delice Backend API' });
});

app.use('/api/auth', authRouter);
app.use('/api/shop', shopRouter);
app.use('/api/item', itemRouter);
app.use('/api/user', userRouter);

// Start server
app.listen(PORT, () => {
    dbConnect();
    console.log(`Server running on port ${PORT}`);
});