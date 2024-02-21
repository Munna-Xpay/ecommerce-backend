import express from 'express';
import "dotenv/config.js";
import mongoose from 'mongoose';
import cors from 'cors'
import productsRouter from './routes/products.js';
import usersRouter from './routes/users.js'
import adminRouter from './routes/admin.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/admin', adminRouter)
app.use('/api/product', productsRouter)
app.use('/api/auth', usersRouter)
app.use("/uploadedFiles", express.static("./uploadedFiles"))


const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("server listening on port " + port)
    try {
        mongoose.connect(process.env.MONGO_URL)
            .then(() => console.log("mongodb connected successfully"))
            .catch((error) => console.log(error))
    } catch (err) {
        console.log(err)
    }
})