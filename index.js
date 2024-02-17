const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/auth')
const cartRoute = require('./routes/cart')
const categoryRoute = require('./routes/category')
const ordersRoute = require('./routes/orders')
const productsRoute = require('./routes/products')
const usersRoute = require('./routes/users')
const wishlistRoute = require('./routes/wishlist')

const app = express();
app.use(express.json())
app.use(cors())
app.use('/api/auth', authRoute)
app.use('/api/cart', cartRoute)
app.use('/api/category', categoryRoute)
app.use('/api/order', ordersRoute)
app.use('/api/product', productsRoute)
app.use('/api/user', usersRoute)
app.use('/api/wishlist', wishlistRoute)

app.get('/', (req, res) => {
    res.send("working")
})

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