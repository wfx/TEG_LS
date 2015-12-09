var board = Snap("#map");
var io = new Socket( "http://127.0.0.1", "8080");
var cont = new Array();  // Continent
var cnty = new Array();  // Country



// Socket...
function Socket ( server, port ) {

    var socket = io.connect(server + ":" + port);

    socket.on('connect', function(data) {
        socket.emit('join', 'CLIENT: Join server');
    });

    socket.on('msg', function(data) {
        console.log(data);
    });

    this.send = function ( type, data ) {
        socket.emit(type, data);
    };
}

function Player () {
    this.id = 0;
    this.name = "";
    this.human = Boolean;
    this.country = new Array();
    this.cards = new Object();

    this.addCountry = function ( countryID ) {
        this.country.push( countryID );
        io.send( "msg", "add countryID " + countryID + "to player / id " + this.name + "/" + this.id );
    };

    this.rmCountry = function ( countryID ) {
        if ( this.country[ countryID ].owned ) {
            var idx = array.indexOf(countryID);
            if ( idx != -1) {
                this.country.splice(idx, 1);
            }
            io.send( "msg", "rm countryID " + countryID + "from player / id " + this.name + "/" + this.id );
        }
    };
}

function Continent () {
    this.id = "";
    this.name = "";
    this.quality = 0;  // each continent hase it's own quality
    this.country = new Array();
    this.artwork = new Object();

    this.addCountry = function ( countryID ) {
        this.country.push( countryID );
    };

    this.isCountry = function ( countryID ) {
        return this.country.indexOf ( countryID );
    };

    this.sendDATA = function () {
        data = {
            id: this.id,
            name: this.name,
            quality: this.quality,
            country: this.country
        }
        io.send("msg", data);
    }
}


function Country () {
    this.id = "";
    this.name = "";
    this.continent = "";
    this.owned = false;
    this.armies = 0;
    this.artwork = "";
    this.boundary = new Array();
    this.fillOpacity = "";  //  Store original fillOpacity -> hoveriver

    this.addBoundary = function ( countryID ) {
        this.boundary.push( countryID );
    };

    this.isBoundary = function ( countryID ) {
        var id = this.boundary.indexOf ( countryID );
        return id;
    };

    this.hoverover_cb = function () {
        this.fillOpacity = this.attr("fill-opacity");
        this.attr({"fill-opacity": 0.2});
    }

    this.hoverout_cb = function () {
        this.attr({"fill-opacity": this.fillOpacity});
    }

    this.click_cb = function() {
        // fix: why is this.name undefined?
        io.send("msg", "Country click event: " + this.name);
    }

    this.sendDATA = function () {
        data = {
            id: this.id,
            name: this.name,
            continent: this.continent,
            owned: this.owned,
            armies: this.armies,
            boundary: this.boundary
        }
        io.send("msg", data);
    }
}

// Get map data...
var foo = Snap.load("../map/map_test.svg", function ( f ) {
    var g = f.selectAll ( "g" );
    g.forEach(function ( el ) {
        if (el.node.attributes["teg:continent"]) {
            // contID = Continent name with removed withespaces
            contID = el.node.attributes["teg:continent"].value.replace(/ /g,'');
            cont[ contID ]  = new Continent();
            cont[ contID ].id = contID;
            cont[ contID ].name = el.node.attributes["teg:continent"].value;
            cont[ contID ].quality = el.node.attributes["teg:quality"].value;
        }
        if (el.node.attributes["teg:country"]) {
            // cntyID = Continent & Country name with removed withespaces
            cntyID = cont + el.node.attributes["teg:country"].value;
            cntyID = cntyID.replace(/ /g,'');
            cnty[ cntyID ] = new Country();
            cnty[ cntyID ].id = cntyID;
            cnty[ cntyID ].continent = contID;
            cont[ contID ].addCountry( cntyID );
            cnty[ cntyID ].name = el.node.attributes["teg:country"].value;
            cnty[ cntyID ].artwork = el;
            cnty[ cntyID ].artwork.hover( cnty[ cntyID ].hoverover_cb, cnty[ cntyID ].hoverout_cb );
            cnty[ cntyID ].artwork.click( cnty[ cntyID ].click_cb );
            data = el.node.attributes["teg:boundary"].value.split(",");
            data.forEach(function( n ){
                cnty[ cntyID ].addBoundary( n );
            });
        }
    });

    // TEST: send to server
    if (typeof contID != 'undefined') {
        io.send("msg", "=== Continent data ===");
        cont[ contID ].sendDATA();
        io.send("msg", "=== Country data ===");
        cont[ contID ].country.forEach(function ( countryID ){
            cnty[ countryID ].sendDATA();
        });
    }

    board.append( f );
} );
