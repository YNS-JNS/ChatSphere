import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './config/connectDB.js';
import Message from './models/message.model.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'

dotenv.config();

// Connect to MongoDB
await connectDB();

// Create Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Define the port to listen on
const port = process.env.PORT || 8080

// Create HTTP server using Express app
// Syntax:http.createServer([options][, requestListener])
const server = http.createServer(app);

// Initialize Socket.io server by passing the HTTP server object
// instance of socket.io by passing the server (the HTTP server) object
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow connections from this origin
        methods: ["GET", "HEAD"] // Allow these HTTP methods
    }
});

// HTTP route for testing
app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello Socket.io!" });
});

app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);

// NB: on: listen, emit: send a message

// Handle Socket.io connections
io.on("connection", (socket) => {
    console.log(`User connected with ID: ${socket.id}`);

    // Room joining event
    socket.on("join_room", (data) => {
        socket.join(data.room); // Join the specified room
        console.log(`User ID: ${socket.id}, ${data.userName} joined room: ${data.room}`);
    });

    // Message sending event
    socket.on("send_message", async (data) => {

        console.log("received message: ", data);

        // Save Message to MongoDB
        const message = new Message(data);
        await message.save();

        // Broadcasting the received message to all clients in the same room
        socket.to(data.room).emit("receive_message", data);
    })

    // Disconnect event
    // built-in
    socket.on("disconnect", () => {
        console.log(`User disconnected with ID: ${socket.id}`);
    })

})

// Start listening on the specified port
server.listen(port, () => {
    console.log('App listening on port: http://localhost:' + port);
});