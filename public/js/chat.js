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

var msgTextBox = jQuery('[name=message]');
// Listening event i.e., newEmail ->Following message prints on cleint side when newEmail is emitted.
socket.on('newMessage', function (message) {
//Using moment.js printitng required time format
var formattedTime = moment(message.createdAt).format('h:mm a');
//using mustache to highlight the users
var template = jQuery('#message-template').html();
var html = Mustache.render(template, {
  text: message.text,
  from:message.from,
  createdAt:formattedTime
});
jQuery('#messages').append(html);
});

//The written logic performs action when form is submitted
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from:'User',
    text:msgTextBox.val()
  }, function () {
    msgTextBox.val('');

  });
});
