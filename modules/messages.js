// TODO: message.js ... rename this thing?

var readline = require("readline"),
  exports = module.exports = {},
  cfg = {}; // stores game configuration

exports.initGame = function(io, socket) {

  console.log('init game...');

  socket.emit("connected");

  initCommandLine(socket);

  //Socket receptions
  socket.on('hostCreateNewGame', hostCreateNewGame);

  // Player Event
  socket.on('disconnect', onDisconnect);
  socket.on("error", onTarzan);
  socket.on("message", onMessage);
  socket.on("advise", onAdvise);
};

// ts: trigger a state
// The server terminal can also all state emite (by hand)
var onAdvise = function(data, cb) {
  if (data.name == "state" && data.value == "ready") {
    this.emit("ts", "viewSceneStartup");
  }
  if (data.name == "viewSceneStartup") {
    this.emit("ts", "viewSceneStartup");
  }
  if (data.name == "viewSceneHost") {
    this.emit("ts", "viewSceneHost");
  }
  if (data.name == "viewSceneJoin") {
    this.emit("ts", "viewSceneJoin");
  }
  if (data.name == "viewScenePlay") {
    cfg = require("../view/game/" + data.opt.game + "/config.json");
    cfg.file.path = "/game/" + data.opt.game + "/";
    this.emit("ts", "viewScenePlay", cfg);

    // prepare

    // this.emit('ts', 'board_get_areas', function(data) {
    //   // ! Client call this function :) !
    //   console.log(data);
    // });

    this.emit("ts", "prepare_done", data);
  }
  if (data.name == "field_clicked") {
    this.emit("ts", "field_clicked", data.value);
  }
  if (data.name == "place") {
    this.emit("ts", "place", data.value);
  }
  if (data.name == "transfer") {
    this.emit("ts", "transfer", data.value);
  }
  if (data.name == "attack") {
    console.log(data);
    this.emit("ts", "attack", data.value);
  }
};

var hostCreateNewGame = function(data) {
  cfg.gameID = data.gameID;
  cfg.socketID = this.id;

  this.emit('newGameCreated', cfg);

  // Join the Room and wait for the players (they have to use the right game.ID)
  this.join(cfg.gameID.toString());

  console.log('host create game: ' + JSON.stringify(cfg));
};

var hostPrepareGame = function(data) {
  io.sockets.in(data.gameID).emit('message', cfg);
  console.log('host start game with id: ' + cfg.gameID);
};

var onDisconnect = function() {
  console.log("Client disconnected.");
};

var onTarzan = function(data) {
  console.log("Client Tarzan!: " + data);
};

var onMessage = function(data) {
  console.log("Client Message: " + data);
};

/* Process */
function initCommandLine(socket) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt("cmd> ");
  rl.prompt();
  rl.on('line', function(line) {
    cmd = line.split(" ");
    switch (cmd[0]) {
      case "help":
        console.log(
          "help : show this \n" +
          "quit : close the server\n" +
          "ts [TRIGGER] [JSON STRING]: trigger a state\n"
        );
        break;
      case "quit":
        console.log("cu later!");
        process.exit(0);
        break;
      case "ts":
        if (cmd[2]) {
          /*
            Optional param (json string)
            example: ts field_data {fieldID:"SouthAmericaBrazil"}
          */
          socket.emit("ts", cmd[1], cmd[2]);
        } else {
          socket.emit("ts", cmd[1], false);
        }
        break;
      default:
        console.log("SERVER: command " + line.trim() + " unknow");
        break;
    }
    rl.prompt();
  }).on("close", function() {
    // ctr+c
    console.log("Have a nice day!");
    process.exit(0);
  });
}
