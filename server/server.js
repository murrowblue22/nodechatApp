const express       = require("express"), 
        ejs         = require("ejs"), 
  bodyParser        = require("body-parser"),
          fs        = require('fs'),
    socketIO        = require('socket.io'),
        http        = require('http'), 
        
        app         = express(),
        server      = http.createServer(app),
        io          = socketIO(server);

const {generateMessage, generateLocationMessage} = require('./utils/message'),
                        {isRealString}           = require('./utils/validation'),
                        {Users}                  = require('./utils/users');

// const path = require('path');
// const publicPath = path.join(__dirname, '../public'); 


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.static('public/css'));
app.use(express.static('public/js'));
app.use(express.static('public/js/libs'));

app.set("view engine", "ejs");

const users = new Users();

app.get('/', (req, res) => {
    // res.writeHead(200, {'Content-type': 'text/html'});
    
    // fs.readFile(`${publicPath}/index.html`, 'utf-8', (err, data) => {
    //     if(err) {
    //         console.log(err);
    //     }
        
    //   res.end(data); 
    // });
    
    res.render("index"); 
});

app.get('/chat', (req, res) => {
   
    console.log(req.params); 
    res.render("chat"); 
});

io.on('connection', (socket) => {
    console.log("New User connected"); 
    
    
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room name are required. '); 
        }
        
        
        //socket.leave('The Office Fans'); 
        
        // io.emit -> io.to('The Office Fans').emit
        // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
        // socket.emit 
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });
    
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);
        
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
        
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text, 
        //     createdAt: new Date().getTime()
        // })
    });
    
    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
    })
    
    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        
        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    })
});

server.listen(process.env.PORT, process.env.IP, function() {
    console.log(`NodeChatApp Started !!!! ${process.env.PORT}`);
}); 
