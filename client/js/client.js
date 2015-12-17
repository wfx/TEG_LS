var board = Snap( "svg#map" );
var boardName = "../map/map_test.svg";
var io = new Socket( "http://127.0.0.1", "8080" );
var cont = []; // Continent
var cnty = []; // Country

// Socket...
function Socket( server, port ) {
  var self = this;
  var socket = io.connect( server + ":" + port );

  socket.on( "connect", function( data ) {
    socket.emit( 'join', 'CLIENT: Hi 5 server' );
  } );

  socket.on( "state", function( data ) {
    console.log( "get token: " + data );
  } )

  socket.on( "msg", function( data ) {
    switch ( data ) {
      case "cinfo":
        for ( var cont_id in cont ) {
          cont[ contID ].sendDATA();
          cont[ contID ].country.forEach( function( cntyID ) {
            cnty[ cntyID ].sendDATA();
          } );
        }
        break;
      default:
        self.send( "unknow query" );
        break;
    }
  } );
  self.send = function( type, data ) {
    socket.emit( type, data );
  };
}

function AskServer() {
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
    typeofgame: "typeofgame" // to know the type of game it is being played
  };
}

function TypeOfGame() {
  var self = this;
  self.secretMission = false;
  self.commonSecretMission = false;
  // self.fogOfWar = false;
  self.rule = 0;
  self.rules = [ "teg", "teg revencha", "risk" ];
}

function Player() {
  var self = this;
  self.id = 0;
  self.name = "";
  self.color = "";
  self.human = false;
  self.country = [];
  self.cards = [];
  self.armies = ""; // hold the amount of armies that can placed

  self.addCountry = function( countryID ) {
    self.country.push( countryID );
    io.send( "msg", "add countryID " + countryID + "to player / id " + self.name + "/" + self.id );
  };

  self.rmCountry = function( countryID ) {
    if ( self.country[ countryID ].owned ) {
      var idx = array.indexOf( countryID );
      if ( idx != -1 ) {
        self.country.splice( idx, 1 );
      }
      io.send( "msg", "rm countryID " + countryID + "from player / id " + self.name + "/" + self.id );
    }
  };
}

function Continent() {
  var self = this;
  self.id = "";
  self.name = "";
  self.quality = 0; // each continent hase it's own quality
  self.country = [];
  self.artwork = {};

  self.addCountry = function( countryID ) {
    self.country.push( countryID );
  };

  self.isCountry = function( countryID ) {
    return self.country.indexOf( countryID );
  };

  self.sendDATA = function() {
    data = {
      id: self.id,
      name: self.name,
      quality: self.quality,
      country: self.country
    }
    io.send( "msg", data );
  }
}

function Country() {
  var self = this;
  self.id = "";
  self.name = "";
  self.continent = "";
  self.owned = false;
  self.armies = 0;
  self.artwork = {};
  self.attrName = "";
  self.attrValue = "";
  self.attrOldValue = "";
  self.boundary = [];
  self.cntyInfo = {}; // infobox (name, armies, etc.)

  self.addBoundary = function( countryID ) {
    self.boundary.push( countryID );
  };

  self.isBoundary = function( countryID ) {
    var id = self.boundary.indexOf( countryID );
    return id;
  };

  self.effect = function( data ) {
    self.attrName = data[ 0 ];
    self.attrValue = data[ 1 ];
  };

  self.onHoverover = function() {
    // TODO: use a css class name for this?
    json = {};
    json[ self.attrName ] = self.attrValue;
    self.artwork.attr( json );
    x = self.artwork.getBBox().cx;
    y = self.artwork.getBBox().cy;
    self.cntyInfo = board.text( x, y, self.name );
    self.cntyInfo.attr( {
      'font-weight': 'bold',
      'font-size': 16,
      'fill': '#fff'
    } );
    console.log( $( self.artwork.node ).addClass( "foomansclass" ) );
  }

  self.onHoverout = function() {
    json = {};
    json[ self.attrName ] = self.attrOldValue;
    self.artwork.attr( json );
    self.cntyInfo.remove();
  }

  self.onCick = function() {
    io.send( "msg", "Country click event: " + self.name );
  }


  // interface
  function countrySelect( cntyID ) {
    //pass
  };

  self.sendDATA = function() {
    data = {
      id: self.id,
      name: self.name,
      continent: self.continent,
      owned: self.owned,
      armies: self.armies,
      boundary: self.boundary
    }
    io.send( "msg", data );
  }
}



function ChipPlace( data ) {
  /*
  @data json
    cntyID: string,
    chipOne: numeric,
    chipFive: numeric,
    chipTen: numeric
  */
}

function ChipRemove( data ) {
  /*
  @data: json
    cntyID: string,
    chipOne: numeric,
    chipFive: numeric,
    chipTen: numeric
  */
}

function ChipMove( data ) {
  /*
  @data: json
    cntyID: string,
    chipOne: numeric,
    chipFive: numeric,
    chipTen: numeric
    cntyID: string // from - to
  */
}

// Get board data...
Snap.load( boardName, function( f ) {
  var g = f.selectAll( "g" );
  g.forEach( function( el ) {
    if ( el.node.attributes[ "teg:continent" ] ) {
      // contID = Continent name with removed withespaces
      contID = el.node.attributes[ "teg:continent" ].value.replace( / /g, '' );
      cont[ contID ] = new Continent();
      cont[ contID ].id = contID;
      cont[ contID ].name = el.node.attributes[ "teg:continent" ].value;
      cont[ contID ].quality = el.node.attributes[ "teg:quality" ].value;
    }
    if ( el.node.attributes[ "teg:country" ] ) {
      // cntyID = Continent & Country name with removed withespaces
      cntyID = cont + el.node.attributes[ "teg:country" ].value;
      cntyID = cntyID.replace( / /g, '' );
      cnty[ cntyID ] = new Country();
      cnty[ cntyID ].id = cntyID;
      cnty[ cntyID ].continent = contID;
      cont[ contID ].addCountry( cntyID );
      cnty[ cntyID ].name = el.node.attributes[ "teg:country" ].value;
      boundary = el.node.attributes[ "teg:boundary" ].value.split( "," );
      boundary.forEach( function( n ) {
        cnty[ cntyID ].addBoundary( n );
      } );
      aw = el.selectAll( "path" );
      aw.forEach( function( el ) {
        if ( el.node.attributes[ "teg:hover" ] ) {
          cnty[ cntyID ].effect( el.node.attributes[ "teg:hover" ].value.split( "," ) );
          cnty[ cntyID ].artwork = el;
          cnty[ cntyID ].artwork.hover( cnty[ cntyID ].onHoverover, cnty[ cntyID ].onHoverout );
          cnty[ cntyID ].artwork.click( cnty[ cntyID ].onCick );
        }
      } );
    }
  } );
  board.append( f );
} );
