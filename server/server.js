const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const port = process.env.PORT || 3200;
const publicPath = path.join(__dirname,'/../public');
const moment = require('moment');

var app = express();
app.use(express.static(publicPath));

//Creating server
var server = http.createServer(app);
//creating socket to server
var io = socketIO(server);
//Setting listener for the socket-> it displays message given when user connected
io.on('connection', (socket) => {
  console.log('New User Connected');
  //Emitting message which will display from server for the user who connected to the server
socket.emit('newMessage', {
  from:'Admin',
  text:'Welcome to the chat app',
  createdAt:moment().valueOf()
});
//using broadcast the message passed to all the users who connected to the serer except to the pserson who emits this event
socket.broadcast.emit('newMessage', {
  from:'Admin',
  text:'new User joined',
  createdAt:moment().valueOf()
});

//Adding Listener event i.e.,Creating email on server side following message prints on server side when emitted this event
socket.on('createMessage', (Message, callback) => {
  console.log('createMessage', Message);
  // display the message in cleint side and server side as it is return in CreateMessage event which has to emit this event from cleint side.
  io.emit('newMessage', {
    from: Message.from,
    text: Message.text,
    createdAt:moment().valueOf()
  });
  callback();
});
//It displays following message if user disconnected
  socket.on('disconnect', ()=>{
    console.log('User disconnected');
  });
});

//Setting the server to the port
  server.listen(port, ()=>{
    console.log(`Server running at${port}`);
});
