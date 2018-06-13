const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const port = process.env.PORT || 3200;
const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'/../public');
const moment = require('moment');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
app.use(express.static(publicPath));

//Creating server
var server = http.createServer(app);
//creating socket to server
var io = socketIO(server);
var users = new Users();
//Setting listener for the socket-> it displays message given when user connected
io.on('connection', (socket) => {
  console.log('New User Connected');

socket.on('join', (params, callback) => {
if(!isRealString(params.name) || !isRealString(params.room)) {
  return callback('Name and room name are required!!!');
}

socket.join(params.room);
users.removeUser(socket.id);
users.addUser(socket.id, params.name, params.room);

io.to(params.room).emit('updateUserList', users.getUserList(params.room));

//Emitting message which will display from server for the user who connected to the server
socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
//using broadcast the message passed to all the users who connected to the serer except to the pserson who emits this event
socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
callback();
});

//Adding Listener event i.e.,Creating email on server side following message prints on server side when emitted this event
socket.on('createMessage', (Message, callback) => {
  var user = users.getUser(socket.id);

  if(user && isRealString(Message.text)) {
    io.to(user.room).emit('newMessage', generateMessage(user.name, Message.text));
  }
  // display the message in cleint side and server side as it is return in CreateMessage event which has to emit this event from cleint side.

  callback();
});

socket.on('createLocationMessage', (coords) => {
  var user = users.getUser(socket.id);

  if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
  }

});

//It displays following message if user disconnected
  socket.on('disconnect', ()=>{
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

//Setting the server to the port
  server.listen(port, ()=>{
    console.log(`Server running at${port}`);
});
