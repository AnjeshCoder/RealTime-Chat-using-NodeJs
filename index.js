// this is a node server for handling socket io connections


// const io = require('socket.io')(8000)
// const users = {};
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // Set your front-end URL here
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', name => {
    console.log('New User', name);

    users[socket.Id] = name
    socket.broadcast.emit('user-joined', name);
  })

  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.Id] })
  })

  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.Id])
    delete users[socket.Id];
  })
})

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
