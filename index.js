import express from 'express';
import router from './src/routes/index.js';
import cors from 'cors';
import { errorHandlerMiddleware } from './src/middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors());
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("hello dunia")
})

// routes
app.use("/api", router)

// error handling middleware
app.use(errorHandlerMiddleware);


app.listen(3000, () => {
    console.log(`server running on port 3000`);
})