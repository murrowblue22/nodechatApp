var socket = io();
            
socket.on('connect', function() {
    console.log('Connected to server');
    
    socket.emit('createMessage', {
        from: "nip@Nodechat.com",
        text: "You think life is important, its how u lived thats important"
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('New Message ', message)
});

