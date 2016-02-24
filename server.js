var express = require("express"),
    http = require("http"),
    socketIO = require("socket.io"),
    conf = require("./config.json");
    msg = require("./modules/messages.js");

/* Init webserver */
var app = express(),
    server = http.createServer(app)
    io = socketIO.listen(server);

server.listen(conf.port);

app.use(express.static(__dirname + "/view"));
app.get('/', function(req, res) {
    res.sendfile(__dirname + "/view/index.html");
});

console.log("Server run at http://127.0.0.1:" + conf.port + "/");

/* Listen events */
io.on('connection', msg.onConnection);
