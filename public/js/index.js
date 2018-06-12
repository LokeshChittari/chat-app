//For cleint side-> it prints following message sin cleint side conrol i.e., browser
var socket = io();
//Listening connect->Prints following message on cleint side if it is connected to server
socket.on('connect', function () {
  console.log('Connected to server');
});
//Listening disconnect->Prints following message on cleint side if it is disconnected to server
socket.on('disconnect', function () {
  console.log('user disconnected from server');
});
//EMitting event i.e., createEmail from cleint side
socket.emit('createEmail', {
  to:'jen@example.com',
  text:'Hey. This is Lokesh'
});

// Listening event i.e., newEmail ->Following message prints on cleint side when newEmail is emitted.
socket.on('newEmail', function (email) {
  console.log('New Email',email);
});
