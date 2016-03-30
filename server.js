/*
Moving to Express 4:
http://expressjs.com/en/guide/migrating-4.html
Logger:
https://github.com/expressjs/morgan
 */

var express = require("express"),
    session = require('express-session'),
    morgan = require('morgan'),
    http = require("http"),
    socketIO = require("socket.io"),
    msg = require("./modules/messages.js"),
    cfg = require("./config.json");

/* Init webserver */
var app = express(),
    server = http.createServer(app),
    io = socketIO.listen(server),
    sess = {};

server.listen(cfg.port);

io.set('log level',1);


// request in the Apache combined format to STDOUT
app.use(morgan('dev'));

// Use the session middleware
// https://github.com/expressjs/
app.use(session({
    secret: 'teg la secuela',
    name: "teglr",
    cookie: {
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true
}));

// Serve static html, js, css, and image files from the 'view' directory
app.use(express.static(__dirname + "/view"));
app.get('/', function(req, res) {
    sess = req.sessionID;
    res.sendFile(__dirname + '/view/index.html');
    console.log('respond main with session id: ' + sess);
});

app.get('/normal', function(req, res) {
    sess = req.sessionID;
    res.sendFile(__dirname + '/view/normal.html');
    console.log('respond normal to: ' + sess);
});

console.log("Server run at http://127.0.0.1:" + cfg.port + "/");

io.sockets.on('connection', function(socket) {
    msg.initGame(io, socket);
});
