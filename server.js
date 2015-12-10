
var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , conf = require('./config.json');

// https://nodejs.org/api/readline.html
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// Webserver
server.listen(conf.port);
app.use(express.static(__dirname + '/client'));

// Path only
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client/index.html');
});

// Webserver info
console.log('Server run at http://127.0.0.1:' + conf.port + '/');

// Message
io.on('connection', function(client) {
    console.log('Client is connected...');

    client.on('join', function(data) {
        console.log(data);
        client.emit('msg', 'SERVER: Hi 5 client');
        rl.setPrompt('cmd> ');
        rl.prompt();
        rl.on('line', function(line) {
            switch(line.trim()) {
                case "help":
                    console.log("quit : for exit");
                    break;
                case "quit":
                    console.log("Servus :)");
                    process.exit(0);
                default:
                    console.log("command " + line.trim() + " unknow");
                    break;
            }
            rl.prompt();
        }).on('close', function() {  // ctr+c
            console.log("Servus :)");
            process.exit(0);
        });
    });

    client.on('msg', function(data) {
        console.log(data);
    });

});
