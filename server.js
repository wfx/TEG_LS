var express = require( "express" ),
  app = express(),
  server = require( "http" ).createServer( app ),
  io = require( "socket.io" ).listen( server ),
  conf = require( "./config.json" );

// https://nodejs.org/api/readline.html
var readline = require( "readline" );
var rl = readline.createInterface( {
  input: process.stdin,
  output: process.stdout
} );

// Webserver
server.listen( conf.port );
app.use( express.static( __dirname + "/client" ) );

// Path only
app.get( '/', function( req, res ) {
  res.sendfile( __dirname + "/client/index.html" );
} );

// Webserver info
console.log( "Server run at http://127.0.0.1:" + conf.port + "/" );

// Message
io.on( 'connection', function( client ) {
  console.log( "Client is connected..." );

  client.on( "join", function( data ) {
    console.log( data );
    client.emit( "msg", "SERVER: Hi 5 client" );
    rl.setPrompt( "cmd> " );
    rl.prompt();
    rl.on( 'line', function( line ) {
      cmd = line.split( " " );
      switch ( cmd[ 0 ] ) {
        case "help":
          console.log(
            "help : show this \n" +
            "quit : will kill youre kitty\n" +
            "getcont: get continent data; ID(Name) or all \n" +
            "getcnty: get country data; ID(Name) or all \n" +
            "place: place amries; cntyID amount"
          );
          break;
        case "quit":
          console.log( "Servus :)" );
          process.exit( 0 );
        case "getcont":
          data = {
            cmd: cmd[ 0 ],
            contID: cmd[ 1 ]
          }
          client.emit( "cmd", data )
          break;
        case "getcnty":
          data = {
            cmd: cmd[ 0 ],
            cntyID: cmd[ 1 ]
          }
          client.emit( "cmd", data )
          break;
        case "place":
          data = {
            state: "place",
            cntyID: cmd[ 1 ],
            chipAmount: cmd[ 2 ]
          };
          client.emit( "state", data )
          break;
        case "remove":
          data = {
            state: "remove",
            cntyID: cmd[ 1 ],
            chipAmount: cmd[ 2 ]
          };
          client.emit( "state", data )
          break;
        case "move":
          data = {
            state: "move",
            cntyIDR: cmd[ 1 ],
            cntyIDP: cmd[ 2 ],
            chipAmount: cmd[ 3 ]
          };
          client.emit( "state", data )
          break;
        default:
          console.log( "SERVER: command " + line.trim() + " unknow" );
          break;
      }
      rl.prompt();
    } ).on( "close", function() { // ctr+c
      console.log( "Servus :)" );
      process.exit( 0 );
    } );
  } );

  // Client send event's (like a click on country)
  client.on( "event", function( data ) {
    console.log( "client send event:\n" + JSON.stringify(data) );
  } );
  // Client answer on a server state command.
  client.on( "state", function( data ) {
    console.log( "client send state:\n" + JSON.stringify(data) );
  } );
  // For all other
  client.on( "msg", function( data ) {
    console.log( "client send msg:\n" + JSON.stringify(data) );
  } );
} );
