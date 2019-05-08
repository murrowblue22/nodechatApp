var socket = io();

function scrollToBottom() {
    //Selectors 
    const messages = jQuery('#messages'); 
    const newMessage = messages.children('li:last-child'); 
    
    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight'); 
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();
    
    let newLastMsgHt = newMessageHeight + lastMessageHeight
    
    if(clientHeight + scrollTop + newLastMsgHt >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};
            
socket.on('connect', function() {
    const params = jQuery.deparam(window.location.search);
    
    socket.emit('join', params, function(err) {
        if(err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error'); 
        }
    });
 });

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    let ol = jQuery('<ol></ol>');
    
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').text(user)); 
    });
    
    jQuery('#users').html(ol);
});


socket.on('newMessage', function(message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    // let li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
    
    const template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    }); 
    
    jQuery('#messages').append(html);
    scrollToBottom();
    
});

socket.on('newLocationMessage', function(message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    // let li = jQuery('<li></li>');
    // let a = jQuery('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    
    const template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    }); 
    
    jQuery('#messages').append(html);
    scrollToBottom(); 
})


jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    
    const messageTextBox = jQuery('[name=message]');
    
    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, function() {
       messageTextBox.val('');
    });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }
    
    locationButton.attr('disabled', 'disabled').text('Sending location ....');
    
    navigator.geolocation.getCurrentPosition(function (position) {
       locationButton.removeAttr('disabled').text('Send Location');
       socket.emit('createLocationMessage', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       });
    }, function() {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('unable to fetch location');
    });
    
});
