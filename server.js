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

  // START Testing
  socket.emit("ts", "start");
  // END
  //
  rl.setPrompt("cmd> ");
  rl.prompt();
  rl.on('line', function(line) {
    cmd = line.split(" ");
    switch (cmd[0]) {
      case "help":
        console.log(
          "help : show this \n" +
          "quit : will kill youre kitty\n" +
          "ts [STATE] [DATA]: trigger a state\n"
        );
        break;
      case "quit":
        console.log("...going to kill youre kitty!");
        process.exit(0);
        break;
      case "ts":
        socket.emit("ts", cmd[1], cmd[2]);
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
/*
  TEG Trigger States (short ts)............................

  Transition        State     Description
  ================= ready ... state ready
  start ........... play .... to start the game
  exit ............ ready ... to exit the game
  client_version .. ready ... client version
  type_of_game .... ready ... to know the type of game
  options ......... ready ... to set options
  error ........... ready ... for any error's

  ================= play .... state play
  field_data ...... play .... info about the field
  field_select .... play .... to select a field
  place ........... place ... to place n figures
  attac ........... attac ... to attack a field by uid
  move ............ move .... to move figures
  card ............ card .... change to card state
  game_lose ....... ready ... lose game
  game_won ........ ready ... won game
  game_surrender .. ready ... to surrender
  save ............ ready ... to save the game
  end_turn ........ play .... to finish youre turn
  error ........... play .... for any error's

  ================= card .... state card
  card_get ........ card .... to get a card
  card_trade ...... card .... to trade a card
  card_done ....... play .... leave card state
  error ........... card .... for any error's

  ================= place ... state place
  field_data ...... place ... info about the field
  field_select .... place ... to select a field
  place ........... place ... place n figures
  place_done ...... play .... place done
  error ........... place ... for any error's

  ================= attac ... state attac
  field_data ...... attac ... info about the field
  field_select .... attac ... to select a field
  attac ........... attac ... to attac a field
  attac_repeating . attac ... DO WE NEED THIS?
  attac_until ..... attac ... DO WE NEED THIS?
  attac_lose ...... attac ... DO WE NEED THIS?
  attac_won ....... attac ... DO WE NEED THIS?
  attac_done ...... play .... attac done
  error ........... attac ... for any error's

  ================= move .... state move
  field_data ...... move .... info about the field
  field_select .... move .... to select a field
  move ............ move .... move figures
  move_done ....... play .... moveing done
  error ........... move .... for any error's

*/
