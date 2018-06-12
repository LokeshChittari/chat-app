const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const port = process.env.PORT || 3200;
const publicPath = path.join(__dirname,'/../public');


var app = express();
app.use(express.static(publicPath));

//Creating server
var server = http.createServer(app);
//creating socket to server
var io = socketIO(server);
//Setting listener for the socket-> it displays message given when user connected
io.on('connection', (socket) => {
  console.log('New User Connected');
//Emitting the event i.e., newEmail event from server side, sending objects
socket.emit('newEmail', {
  from:'mike@example.com',
  text:'Hey. What is going on.',
  createdAt:123
});
//Adding Listener event i.e.,Creating email on server side following message prints on server side when emitted this event
socket.on('createEmail', (newEmail) => {
  console.log('createEmail', newEmail);
});
//It displays following message if user disconnected
  socket.on('disconnect', ()=>{
    console.log('User disconnected');
  });
});

app.get('/', (req, res)=>{
  res.render('index.hbs');
});
  server.listen(port, ()=>{
    console.log(`Server running at${port}`);
});
