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
          "continent [CONTINENT] : It shows info about the continent or all\n" +
          "country [COUNTRY]: It shows info about the country or all\n" +
          "place [TYPE] [AMOUNT] [COUNTRY]: place figure\n" +
          "remove [TYPE] [AMOUNT] [COUNTRY]: remove figure\n" +
          "move [COUNTRY] [COUNTRY] [TYPE] [AMOUNT]: move figure"
        );
        break;
      case "quit":
        console.log("...going to kill youre kitty!");
        process.exit(0);
        break;
      case "continents":
        socket.emit("continents", {
          id: cmd[1]
        });
        break;
      case "country":
        socket.emit("country", {
          id: cmd[1]
        });
        break;
      case "place":
        socket.emit("place", {
          id: cmd[1],
          type: cmd[2],
          amount: cmd[3]
        });
        break;
      case "remove":
        socket.emit("remove", {
          id: cmd[1],
          type: cmd[2],
          amount: cmd[3]
        });
        break;
      case "move":
        socket.emit("move", {
          idFrom: cmd[1],
          idTo: cmd[2],
          type: cmd[3],
          amount: cmd[4]
        });
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
  STATES: ..... _________________________________
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
  error ......... for any error's
  */
  socket.on("start", function(data) {
    console.log("receive start:\n" + data);
  });

  socket.on("socket", function(data) {
    console.log("receive socket:\n" + data);
  });

  socket.on("status", function(data) {
    console.log("receive status:\n" + data);
  });

  socket.on("message", function(data) {
    console.log("receive message:\n" + data);
  });

  socket.on("exit", function(data) {
    console.log("receive exit:\n" + data);
  });

  socket.on("cversion", function(data) {
    console.log("receive cversion:\n" + data);
  });

  socket.on("sversion", function(data) {
    console.log("receive sversion:\n" + data);
  });

  socket.on("pversion", function(data) {
    console.log("receive pversion:\n" + data);
  });

  socket.on("playerID", function(data) {
    console.log("receive playerID:\n" + data);
  });

  socket.on("help", function(data) {
    console.log("receive help:\n" + data);
  });

  socket.on("continent", function(data) {
    console.log("receive continent:\n" + data);
  });

  socket.on("country", function(data) {
    console.log("receive country:\n" + data);
  });

  socket.on("place", function(data) {
    console.log("receive place:\n" + data);
  });

  socket.on("remove", function(data) {
    console.log("receive remove:\n" + data);
  });

  socket.on("move", function(data) {
    console.log("receive move:\n" + data);
  });

  socket.on("attac", function(data) {
    console.log("receive attac:\n" + data);
  });

  socket.on("turn", function(data) {
    console.log("receive turn:\n" + data);
  });

  socket.on("exchange", function(data) {
    console.log("receive exchange:\n" + data);
  });

  socket.on("mission", function(data) {
    console.log("receive mission:\n" + data);
  });

  socket.on("color", function(data) {
    console.log("receive color:\n" + data);
  });

  socket.on("echo", function(data) {
    console.log("receive echo:\n" + data);
  });

  socket.on("surrender", function(data) {
    console.log("receive surrender:\n" + data);
  });

  socket.on("options", function(data) {
    console.log("receive options:\n" + data);
  });

  socket.on("robot", function(data) {
    console.log("receive robot:\n" + data);
  });

  socket.on("typeofgame", function(data) {
    console.log("receive typeofgame:\n" + data);
  });

  socket.on("error", function(data) {
    u.cout("receive error: %s", data);
  });
});
