import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
 
const app = express();


const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
app.use(cors({
    origin: corsOrigin,
    credentials:true 
}))

//  Add this line to parse incoming JSON:
app.use(express.json());

// (Optional, if you also send form data from other parts of your app)
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()) 


//  Add this line to parse incoming JSON:
app.use(express.json());

// (Optional, if you also send form data from other parts of your app)
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()) 
// for middleware 

import testRouter from "./routes/test.route.js";
app.use("/api/test", testRouter);


import userRouter from './routes/user.route.js'
app.use('/api/user',userRouter)

import shipmentsRouter from './routes/shipments.route.js'
app.use('/api/shipments', shipmentsRouter)



import truckRouter from './routes/truck.route.js'
app.use('/api/trucks', truckRouter)


// optimization routes
import optimizationRouter from './routes/optimization.route.js'
app.use("/api/optimize", optimizationRouter);

import bookingRouter from './routes/booking.route.js'
app.use("/api/bookings", bookingRouter);


import dashboardRouter from "./routes/dashboard.route.js";

app.use("/api/dashboard", dashboardRouter);

import analyticsRouter from "./routes/analytics.route.js";
app.use("/api/analytics", analyticsRouter);

import dealerRouter from "./routes/dealer.route.js";
app.use("/api/dealer", dealerRouter);

export default app; 
 

