const express = require('express');
require("dotenv").config();
const cors = require('cors');
const mongoConnection = require("./util/mongoConnection");
const http = require('http');
const { createClient } = require('redis');
const socketIo = require('socket.io');
const users = require('./User/UserController');

const port = 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const redisClient = createClient();
redisClient.connect().catch(console.error);

app.use(express.json());
app.use(cors());

mongoConnection();

app.get('/', (req, res) => res.send('server is running'));
app.use('/api', users);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(port, '0.0.0.0', () => console.log(`Server is running on port ${port}...`));