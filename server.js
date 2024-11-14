import express from "express";
import cors from "cors"
import { forgotPassword, resetPassword, loginUser, registerUser } from './controllers/authController.js';
import vehicleRouters from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from './routes/payment.js'

import mongoose from "mongoose";
mongoose.set('strictQuery', true);

import dotenv from "dotenv";
dotenv.config();


// Express App:
const app = express();
app.use(express.json());

// Middleware for CORS:
app.use(cors({
    origin: `${process.env.CLIENT}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'] ,
    credentials: true,
    optionsSuccessStatus: 204
}));

app.options('*', cors());


// Database Connection:
const DBURL = process.env.DBURL;
const connectDb = async () => {
    try {
        await mongoose.connect(DBURL)
        console.log("MongoDB Connected Successfully using Mongoose ")
    } catch (error) {
        console.error("Error Connecting to MongoDB", error)
        process.exit(1);
    }
};
connectDb();

// Routes:
app.post('/forgot-password', forgotPassword);
app.post('/reset-password', resetPassword);
app.post('/login', loginUser);
app.post('/register', registerUser);

app.use("/vehicles", vehicleRouters);
app.use("/booking", bookingRoutes)
app.use("/user", userRoutes);
app.use("/reviews", reviewRoutes);
app.use("/payment", paymentRoutes);

// Start the server:
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
});



