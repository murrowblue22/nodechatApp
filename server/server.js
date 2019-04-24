const express       = require("express"), 
        ejs         = require("ejs"), 
  bodyParser        = require("body-parser"),
          fs        = require('fs'),
    socketIO        = require('socket.io'),
        http        = require('http'), 
        
        app         = express(),
        server      = http.createServer(app),
        io          = socketIO(server);

const path = require('path');
const publicPath = path.join(__dirname, '../public'); 


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-type': 'text/html'});
    
    fs.readFile(`${publicPath}/index.html`, 'utf-8', (err, data) => {
        if(err) {
            console.log(err);
        }
        
       res.end(data); 
    });
});

io.on('connection', (socket) => {
    console.log("New User connected"); 
    
    
    socket.emit('newMessage', {
        from: 'Admin', 
        text: 'Welcome to the chat app',
        createdAt: new Date().getTime()
    });
    
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined', 
        createdAt: new Date().getTime()
    })
    
    
    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        
        io.emit('newMessage', {
            from: message.from, 
            text: message.text,
            createdAt: new Date().getTime()
        });
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text, 
        //     createdAt: new Date().getTime()
        // })
    });
    
    socket.on('disconnect', () => {
        console.log("A connected client has disconnected !!!");
    })
});

server.listen(process.env.PORT, process.env.IP, function() {
    console.log(`NodeChatApp Started !!!! ${process.env.PORT}`);
}); 
