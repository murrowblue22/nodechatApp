const express       = require("express"), 
        ejs         = require("ejs"), 
  bodyParser        = require("body-parser"),
          fs        = require('fs'),
        app         = express();

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

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("NodeChatApp Started !!!!");
}); 
