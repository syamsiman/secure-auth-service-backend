import express from 'express';
import router from './src/routes/index.js';
import cors from 'cors';

const app = express();

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors());

app.get('/', (req, res) => {
    res.send("hello dunia")
})

// routes
app.use("/api", router)


app.listen(3000, () => {
    console.log(`server running on port 3000`);
})