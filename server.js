/*
Moving to Express 4:
http://expressjs.com/en/guide/migrating-4.html
Logger:
https://github.com/expressjs/morgan
Debug:
https://www.npmjs.com/package/debug

Run in Terminal DEBUG=* node server.js
 */

var express = require("express"),
    session = require('express-session'),
    morgan = require('morgan'),
    debug = require('debug'),
    http = require("http"),
    socketIO = require("socket.io"),
    msg = require("./modules/messages.js"),
    cfg = require("./config.json");

/* Init webserver */
var app = express(),
    server = http.createServer(app),
    io = socketIO.listen(server),
    sess = {};

server.listen(cfg.port, cfg.ip);

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
    console.log('respond client with session id: ' + sess);
});

console.log("Server run at http://127.0.0.1:" + cfg.port + "/");

io.sockets.on('connection', function(socket) {
    msg.initGame(io, socket);
});
