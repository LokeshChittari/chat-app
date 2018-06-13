//For cleint side-> it prints following message sin cleint side conrol i.e., browser
var socket = io();
function scrollToBottom () {
//Selectors
var messages = jQuery('#messages');
var newMessage = messages.children('li:last-child');
//Heights
var clientHeight = messages.prop('clientHeight');
var scrollTop = messages.prop('scrollTop');
var scrollHeight = messages.prop('scrollHeight');
var newMessageHeight = newMessage.innerHeight();
var lastMessageHeight = newMessage.prev().innerHeight();

if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
  messages.scrollTop(scrollHeight);
}
}

//Listening connect->Prints following message on cleint side if it is connected to server
socket.on('connect', function () {

  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if(err){
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});
//Listening disconnect->Prints following message on cleint side if it is disconnected to server
socket.on('disconnect', function () {
  console.log('user disconnected from server');
});


socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
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
scrollToBottom();
});

socket.on('newLocationMessage', function(messsage) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from:message.from,
    url:message.url,
    createdAt: formattedTime
  });
jQuery('#messages').append(html);
scrollToBottom();
});
//The written logic performs action when form is submitted
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
var msgTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text:msgTextBox.val()
  }, function () {
    msgTextBox.val('');

  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude :position.coords.longitude
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Send location');
    alert('unable to fetch location');
  });
});
