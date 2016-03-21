var readline = require("readline"),
    exports = module.exports = {},
    respondData = {},
    clients = {}; // store socket.id's

exports.onConnection = function(socket) {

    initCommandLine(socket);

    //Sockect receptions
    socket.on('authenticate', onAuthenticate);
    socket.on('disconnect', onDisconnect);
    socket.on("receive", onReceive);
    socket.on("tarzan", onTarzan);
    socket.on("echo", onEcho);
    socket.on("respond", onRespond);

    // Socket emissions
    socket.emit("message", "client id: " + socket.id);
    socket.emit("message", "i take your brain to another dimension, pay close attention!");

    var triggerState = function(trigger, data) {
        socket.emit("ts", trigger, data);
    };

    // TESTING GAME: teg (game folders)
    var gameID = "teg",
        conf = require("../view/game/" + gameID + "/config.json");

    triggerState("set_game", conf);
    triggerState("start");
    triggerState("place");

    var foo = JSON.stringify({
        fieldID: "SouthAmericaPeru"
    });
    triggerState("get_field", foo);

    // TESTING END:
};

/* Events */
var onAuthenticate = function(data) {
    console.log('Player ' + data.player + ' join ' + data.game);
    // Check...
};

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

var onRespond = function(data) {
    console.log("client respond");
    respondData = data;
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
                    "ts [STATE] [JSON STRING]: trigger a state\n"
                );
                break;
            case "quit":
                console.log("...going to kill youre kitty!");
                process.exit(0);
                break;
            case "ts":
                if (cmd[2]) {
                    /*
                      Optional param (json string)
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
