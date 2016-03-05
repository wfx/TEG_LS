var express = require("express"),
    http = require("http"),
    socketIO = require("socket.io"),
    conf = require("./config.json"),
    msg = require("./modules/messages.js"),
    MemoryStore = express.session.MemoryStore,
    session_key = 'express.sid',
    session_secret = 'for signed cookies',
    session_store = new MemoryStore(),
    cookieParser = express.cookieParser(session_secret);

/* Init webserver */
var app = express(),
    server = http.createServer(app),
    io = socketIO.listen(server);

server.listen(conf.port);

app.use(cookieParser);
app.use(express.session({
  secret: session_secret,
  store: session_store,
  key: session_key
}));

app.use(express.static(__dirname + "/view"));
app.get('/', function(req, res) {
    res.sendfile(__dirname + "/view/index.html");
});

console.log("Server run at http://127.0.0.1:" + conf.port + "/");

/* Listen events */
io.on('connection', msg.onConnection);
