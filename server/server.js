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
