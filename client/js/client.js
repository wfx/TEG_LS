/*
http://snapsvg.io/demos/
http://snapsvg.io/docs/
http://svg.dabbles.info/
*/

// TODO: wrong place for var boardName.
var board = Snap( "svg#map" );
var boardName = "../map/map_test.svg";
var cont = []; // Continent
var cnty = []; // Country

function Chip() {
  var self = this;

  self.Place = function( data ) {
    /*
    @data json
      cntyID: string,
      chipAmount: numeric
    */
    cnty[ data.cntyID ].armies += data.chipAmount
    console.log( "placed at: " +
      cnty[ data.cntyID ].id + ", " +
      cnty[ data.cntyID ].armies + " armies" );
  }

  self.Remove = function( data ) {
    /*
    @data: json
      cntyID: string,
      chipAmount: numeric
    */
    cnty[ data.cntyID ].armies -= data.chipAmount
    console.log( "placed at: " +
      cnty[ data.cntyID ].id + ", " +
      cnty[ data.cntyID ].armies + " armies" );
  }

  self.Move = function( data ) {
    /*
    @data: json
      cntyID: string, // from
      chipAmount: numeric
      cntyID: string  // to
    */
    cnty[ data.cntyID ].armies -= data.chipAmount
    console.log( "placed at: " +
      cnty[ data.cntyID ].id + ", " +
      cnty[ data.cntyID ].armies + " armies" );
    cnty[ data.cntyID ].armies += data.chipAmount
    console.log( "placed at: " +
      cnty[ data.cntyID ].id + ", " +
      cnty[ data.cntyID ].armies + " armies" );
  }
}

function Dice( data ) {
  var self = this;
  /*
  @data: json
    diceAttac[n]: numeric // n depend on rules -> 0 to 2
    diceDefend[n]: numerc // n depend on rules -> 0 to 1
  */
}

// Get all from the board data...
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
      cntyID = contID + el.node.attributes[ "teg:country" ].value.replace( / /g, '' );
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
          cnty[ cntyID ].artwork = el;
          cnty[ cntyID ].onHoverEffect( el.node.attributes[ "teg:hover" ].value.split( "," ) );
          // .hover and .click are snap.svg events
          cnty[ cntyID ].artwork.hover( cnty[ cntyID ].onHoverover, cnty[ cntyID ].onHoverout );
          cnty[ cntyID ].artwork.click( cnty[ cntyID ].onCick );
        }
      } );
    }
  } );
  board.append( f );
} );
// conect to server and listen for event's.
var io = new Socket( "http://127.0.0.1", "8080" );
