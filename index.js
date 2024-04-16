import express from 'express';
import "dotenv/config.js";
import mongoose from 'mongoose';
import cors from 'cors'
import productsRouter from './routes/products.js';
import usersRouter from './routes/users.js'
import adminRouter from './routes/admin.js'
import sellerRouter from './routes/seller.js'
import http from 'http'
import { Server } from 'socket.io';

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"] 
    }
});

app.use(express.json())
app.use(cors())
app.use('/api/admin', adminRouter)
app.use('/api/product', productsRouter)
app.use('/api/auth', usersRouter)
app.use('/api/seller', sellerRouter)
app.use("/uploadedFiles", express.static("./uploadedFiles"))


const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log("server listening on port " + port)
    try {
        mongoose.connect(process.env.MONGO_URL)
            .then(() => console.log("mongodb connected successfully"))
            .catch((error) => console.log(error))
    } catch (err) {
        console.log(err)
    }
})


let clients = [];

const addClients = (clientId, socketId) => {
    if (clients.every((client) => client.clientId !== clientId)) {
        clients.push({ clientId, socketId })
    }
}
const removeClient = (socketId) => {
    clients = clients.filter((client) => client.socketId !== socketId)
}

const getClient = (receiverId) => {
    return clients.find((client) => client.clientId == receiverId);
}

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on("sendClient", (clientId) => {
        console.log(clientId)
        addClients(clientId, socket.id)
        console.log(clients)
    })

    socket.on("sendNotify", ({ receiverId, msg }) => {
        console.log(receiverId, msg)
        const clientDetails = getClient(receiverId)
        console.log(clientDetails?.socketId)
        if (clientDetails?.socketId) {
            io.to(clientDetails?.socketId).emit("getNotify", msg)
        }
    })
    socket.on("sendNotifyCheckout", ({ products,user }) => {
        // console.log(products);
        // console.log(user);
        products.map((i)=>{
        const clientDetails = getClient(i.product?.seller._id)
       // console.log(clientDetails?.socketId)
        if (clientDetails?.socketId) {
            io.to(clientDetails?.socketId).emit("getNotifyCheckout", `${user} placed an order for ${i.product.title}`)
        }
    })
    })

    socket.on('disconnect', () => {
        removeClient(socket.id)
        console.log('Client disconnected');
    });
});