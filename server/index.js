const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./src/models/db/connector');
const { errorHandler } = require('./src/middlewares/errorHandler');
// body-parser no longer needed in newer versions of express -aaron
// const bodyParser = require ('body-parser');

// environment variables in .env file
require('dotenv').config();

// connects to ATLAS_URI 
connectDB();

// create express server
const app = express();

// port that server will run on
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect to remote mongoDB through environment variable ATLAS_URI
const uri = process.env.ATLAS_URI;

const horseRouter = require('./src/routes/horse');
const lessonRouter = require('./src/routes/lesson');
const skillRouter = require('./src/routes/skill');
const userRouter = require('./src/routes/user');

app.use('/horses', horseRouter);
app.use('/lessons', lessonRouter);
app.use('/skills', skillRouter);
app.use('/users', userRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});