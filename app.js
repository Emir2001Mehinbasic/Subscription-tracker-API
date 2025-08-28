import express from 'express';

import {PORT} from './config/env.js';

import userRouter from './routes/user.routes.js';

import authRouter from './routes/auth.routes.js';

import subscriptionRouter from './routes/subscription.routes.js';
import { connect } from 'mongoose';
import connectDB from './database/mongodb.js';

const app = express();
 
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);



app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API');
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

   await connectDB();
});

export default app;