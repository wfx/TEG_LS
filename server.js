var express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server),
  conf = require("./config.json");

// https://nodejs.org/api/readline.html
var readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Init webserver
server.listen(conf.port);
app.use(express.static(__dirname + "/view"));

// Path only
app.get('/', function(req, res) {
  res.sendfile(__dirname + "/view/index.html");
});

// Webserver info
console.log("Server run at http://127.0.0.1:" + conf.port + "/");

// Message
io.on('connection', function(socket) {
  console.log("a client is connected.");

  socket.emit("message", "client connect with id: ...");
  rl.setPrompt("cmd> ");
  rl.prompt();
  rl.on('line', function(line) {
    cmd = line.split(" ");
    switch (cmd[0]) {
      case "help":
        console.log(
          "help : show this \n" +
          "quit : will kill youre kitty\n" +
          "state [STATE] [DATA]: trigger a state\n"
        );
        break;
      case "quit":
        console.log("...going to kill youre kitty!");
        process.exit(0);
        break;
      case "state":
        socket.emit("state", cmd[1], cmd[2]);
        break;
      default:
        console.log("SERVER: command " + line.trim() + " unknow");
        break;
    }
    rl.prompt();
  }).on("close", function() { // ctr+c
    console.log("Servus :)");
    process.exit(0);
  });

  socket.on('disconnect', function() {
    console.log('client disconnected.');
  });
  /*
  TEG States.....................................
  start: ...... to start the game
  status: ..... shows the status of the players
  message: .... to send a message
  exit: ....... to exit the game
  cversion: ... client version
  sversion: ... server version
  pversion: ... protocol version
  playerID: ... to register as a player
  help: ....... to ask for help
  country: .... It shows info about the country
  continent: .. It shows info about the continet
  place: ...... to place armies
  remove: ..... to remove armies
  move: ....... to move armies
  attac: ...... to attack a country
  turn: ....... to finish youre turn
  exchange: ... to exchange your cards for armies
  mission: .... request a mission
  color: ...... to select a color
  echo: ....... to set an async callback
  surrender: .. to surrender
  options: .... to set options
  robot: ...... to play with a robot
  typeofgame:.. to know the type of game
  error ....... for any error's
  */

  socket.on("receive", function(data) {
    console.log("receive data:\n" + data);
  });

  socket.on("tarzan", function(data) {
    console.log("tarzan: " + data);
  });

  socket.on("echo", function(data) {
    console.log("echo: " + data);
  });
});
