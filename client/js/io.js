// http://socket.io/docs/

function Socket( server, port ) {
  /*
  1, Connect to server.
  2, Join game.
  3, wait for command or state.
  4, leave game.
  5, Disconnect from server.
  */
  var self = this;
  var socket = io.connect( server + ":" + port );
  // init
  socket.on( "connect", function( data ) {
    socket.emit( 'join', 'CLIENT: Hi 5 server' );
  } );

  // state
  socket.on( "state", function( data ) {
    var done = "failed";
    switch ( data.state ) {
      // answer with state name or state_failed.
      case "place":
        /*
          @data: json
          cntyID: string,
          chipAmount: numeric
        */
        if ( cnty[ data.cntyID ].armiesPlace( data.chipAmount ) ) {
          // board.chipPlace( data.cntyID, data.chipAmount );
          done = "place";
        }
        break;
      case "remove":
        /*
          @data: json
          cntyID: string,
          chipAmount: numeric
        */
        if ( cnty[ data.cntyID ].armiesRemove( data.chipAmount ) ) {
          // board.chipRemove( data.cntyID, data.chipAmount );
          done = "remove";
        }
        break;
      case "move":
        /*
          @data: json
          cntyIDR: string, // Remove from
          cntyIDP: string  // Place to
          chipAmount: numeric
        */
        if ( cnty[ data.cntyIDR ].armiesRemove( data.chipAmount ) ) {
          // board.chipMove( data.cntyIDR, data.cntyIDP, data.chipAmount );
          if ( cnty[ data.cntyIDP ].armiesPlace( data.chipAmount ) ) {
            done = "move";
          }
        }
        break;
      default:
        self.send( "msg", "i get a unknow state?" );
        break;
    }
    self.send( "state", done );
  } );

  // commands mostly for debug/testing
  socket.on( "cmd", function( data ) {
    switch ( data.cmd ) {
      // info of continent @all @contID
      case "getcont":
        if ( typeof( data.contID ) == "undefined" ) {
          for ( var cont_id in cont ) {
            self.send( "msg", cont[ cont_id ].getDATA() )
            cont[ cont_id ].country.forEach( function( cntyID ) {
              self.send( "msg", cnty[ cntyID ].getDATA() )
            } );
          }
        } else {
          self.send( "msg", cont[ data.contID ].getDATA() )
          cont[ data.contID ].country.forEach( function( cntyID ) {
            self.send( "msg", cnty[ cntyID ].getDATA() )
          } );
        }
        break;
        // info of country @all @cntyID
      case "getcnty":
        if ( typeof( data.cntyID ) != "undefined" ) {
          self.send( "msg", cnty[ data.cntyID ].getDATA() )
        } else {
          self.send( "msg", "he bro, i need a country id" )
        }
        break;
      default:
        self.send( "dont know :p" );
        break;
    }
  } );
  self.send = function( type, data ) {
    socket.emit( type, data );
  };
}

function ServerState() {
  var self = this;
  var self, token = {
    start: "start", // to start the game
    status: "status", // shows the status of the players
    message: "message", // to send a message
    exit: "exit", // to exit the game
    cversion: "cversion", // client version
    sversion: "sversion", // server version
    pversion: "pversion", // protocol version
    playerID: "playerID", // to register as a player
    help: "help", // to ask for help
    countries: "countries", // It shows info about the countries
    place: "place", // to place armies
    remove: "remove", // to remove armies
    move: "move", // to move armies
    attac: "attac", // to attack a country
    turn: "turn", // to finish youre turn
    exchange: "exchange", // to exchange your cards for armies
    mission: "mission", // request a mission
    color: "color", // to select a color
    echo: "echo", // to set an async callback
    surrender: "surrender", // to surrender
    options: "options", // to set options
    robot: "robot", // to play with a robot
    typeofgame: "typeofgame" // to know the type of game
  };
}
