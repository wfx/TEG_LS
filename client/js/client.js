var board = Snap( "svg#board" ),
    players = [],
    ui = new UserInterface(),
    map = new Map( {
        surface: board.group(),
        file: "../map/map_test.svg",
        setViewBox: board
    } );

map.use();
// connect to server and listen for event's.
var io = new Socket( "http://127.0.0.1", "8080" );
