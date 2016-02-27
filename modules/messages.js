var readline = require("readline");

var exports = module.exports = {};

exports.onConnection = function(socket) {
  console.log("a client is connected.");

  initCommandLine(socket);

  // Socket emissions
  socket.emit("message", "client connect with id: ...");
  socket.emit("ts", "start"); // TESTING

  //Sockect receptions
  socket.on('disconnect', onDisconnect);
  socket.on("receive", onReceive);
  socket.on("tarzan", onTarzan);
  socket.on("echo", onEcho);
};


/* Events */
var onDisconnect = function() {
  console.log('client disconnected.');
};

var onReceive = function(data) {
  console.log("receive data:\n" + data);
};

var onTarzan = function(data) {
  console.log("tarzan: " + data);
};

var onEcho = function(data) {
  console.log("echo: " + data);
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
          "quit : will kill youre kitty\n" +
          "ts [STATE] [DATA]: trigger a state\n"
        );
        break;
      case "quit":
        console.log("...going to kill youre kitty!");
        process.exit(0);
        break;
      case "ts":
        if (cmd[2]) {
          /*
            We have a optional param (json string)
            example: ts field_data {"fieldID":"SouthAmericaBrazil"}
          */
          socket.emit("ts", cmd[1], JSON.parse(cmd[2]));
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
    console.log("have a nice day!");
    process.exit(0);
  });
}
