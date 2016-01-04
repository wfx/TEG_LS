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
app.use(express.static(__dirname + "/client"));

// Path only
app.get('/', function(req, res) {
  res.sendfile(__dirname + "/client/index.html");
});

// Webserver info
console.log("Server run at http://127.0.0.1:" + conf.port + "/");

// Message
io.on('connection', function(client) {
  console.log("a client is connected.");

  //client.on("join", function(data) {
  //  console.log(data);
    client.emit("message", "client connect with id: ...");
    rl.setPrompt("cmd> ");
    rl.prompt();
    rl.on('line', function(line) {
      cmd = line.split(" ");
      switch (cmd[0]) {
        case "help":
          console.log(
            "help : show this \n" +
            "quit : will kill youre kitty\n" +
            "continents: It shows info about the continent CONTINENT or all \n" +
            "countries: It shows info about the country COUNTRY or all \n" +
            "place: place figure; TYPE AMOUNT COUNTRY\n" +
            "remove: remove figure; TYPE AMOUNT COUNTRY\n" +
            "move: move figure, COUNTRY COUNTRY TYPE AMOUNT"
          );
          break;
        case "quit":
          console.log("...going to kill youre kitty!");
          process.exit(0);
          break;
        case "continents":
          client.emit("continents", { id: cmd[1] });
          break;
        case "countries":
          client.emit("countries", { id: cmd[1] });
          break;
        case "place":
          client.emit("place", { id: cmd[1], type: cmd[2], amount: cmd[3] });
          break;
        case "remove":
          client.emit("remove", { id: cmd[1], type: cmd[2], amount: cmd[3] });
          break;
        case "move":
          client.emit("move", { idFrom: cmd[1], idTo: cmd[2], type: cmd[3], amount: cmd[4] });
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

  //});

  client.on('disconnect', function() {
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
  countries: .. It shows info about the countries
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
  */
  client.on("start", function(data) {
    console.log("get start:\n" + JSON.stringify(data));
  });

  client.on("client", function(data) {
    console.log("get client:\n" + JSON.stringify(data));
  });

  client.on("status", function(data) {
    console.log("get status:\n" + JSON.stringify(data));
  });

  client.on("message", function(data) {
    console.log("get message:\n" + JSON.stringify(data));
  });

  client.on("exit", function(data) {
    console.log("get exit:\n" + JSON.stringify(data));
  });

  client.on("cversion", function(data) {
    console.log("get cversion:\n" + JSON.stringify(data));
  });

  client.on("sversion", function(data) {
    console.log("get sversion:\n" + JSON.stringify(data));
  });

  client.on("pversion", function(data) {
    console.log("get pversion:\n" + JSON.stringify(data));
  });

  client.on("playerID", function(data) {
    console.log("get playerID:\n" + JSON.stringify(data));
  });

  client.on("help", function(data) {
    console.log("get help:\n" + JSON.stringify(data));
  });

  client.on("continents", function(data) {
    console.log("get continents:\n" + JSON.stringify(data));
  });

  client.on("countries", function(data) {
    console.log("get countries:\n" + JSON.stringify(data));
  });

  client.on("place", function(data) {
    console.log("get place:\n" + JSON.stringify(data));
  });

  client.on("remove", function(data) {
    console.log("get remove:\n" + JSON.stringify(data));
  });

  client.on("move", function(data) {
    console.log("get move:\n" + JSON.stringify(data));
  });

  client.on("attac", function(data) {
    console.log("get attac:\n" + JSON.stringify(data));
  });

  client.on("turn", function(data) {
    console.log("get turn:\n" + JSON.stringify(data));
  });

  client.on("exchange", function(data) {
    console.log("get exchange:\n" + JSON.stringify(data));
  });

  client.on("mission", function(data) {
    console.log("get mission:\n" + JSON.stringify(data));
  });

  client.on("color", function(data) {
    console.log("get color:\n" + JSON.stringify(data));
  });

  client.on("echo", function(data) {
    console.log("get echo:\n" + JSON.stringify(data));
  });

  client.on("surrender", function(data) {
    console.log("get surrender:\n" + JSON.stringify(data));
  });

  client.on("options", function(data) {
    console.log("get options:\n" + JSON.stringify(data));
  });

  client.on("robot", function(data) {
    console.log("get robot:\n" + JSON.stringify(data));
  });

  client.on("typeofgame", function(data) {
    console.log("get typeofgame:\n" + JSON.stringify(data));
  });
});
