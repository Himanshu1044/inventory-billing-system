import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';


// importing routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';

const app = express();
const PORT = 8000;
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// mongoDB connection 
mongoose.connect(process.env.mongoDbURL)
    .then(() => { console.log("Connection successfull...") })
    .catch((err) => { console.log(err) })

// Routes 

app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.log('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
})


app.get('/', (req, res) => {
    res.json({
        message: "Inventory & Billing Management System API is running",
    });
})

// 404 error handling
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
})
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})