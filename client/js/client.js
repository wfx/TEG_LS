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
    var self = this;
    self.id = 0;
    self.name = "";
    self.human = Boolean;
    self.country = new Array();
    self.cards = new Object();

    self.addCountry = function ( countryID ) {
        self.country.push( countryID );
        io.send( "msg", "add countryID " + countryID + "to player / id " + self.name + "/" + self.id );
    };

    this.rmCountry = function ( countryID ) {
        if ( self.country[ countryID ].owned ) {
            var idx = array.indexOf(countryID);
            if ( idx != -1) {
                self.country.splice(idx, 1);
            }
            io.send( "msg", "rm countryID " + countryID + "from player / id " + self.name + "/" + self.id );
        }
    };
}

function Continent () {
    var self = this;
    self.id = "";
    self.name = "";
    self.quality = 0;  // each continent hase it's own quality
    self.country = new Array();
    self.artwork = new Object();

    self.addCountry = function ( countryID ) {
        self.country.push( countryID );
    };

    self.isCountry = function ( countryID ) {
        return self.country.indexOf ( countryID );
    };

    self.sendDATA = function () {
        data = {
            id: self.id,
            name: self.name,
            quality: self.quality,
            country: self.country
        }
        io.send("msg", data);
    }
}


function Country () {
    var self = this;
    self.id = "";
    self.name = "";
    self.continent = "";
    self.owned = false;
    self.armies = 0;
    self.artwork = "";
    self.boundary = new Array();
    self.fillOpacity = "";  //  Store original fillOpacity -> hoveriver

    self.addBoundary = function ( countryID ) {
        self.boundary.push( countryID );
    };

    self.isBoundary = function ( countryID ) {
        var id = self.boundary.indexOf ( countryID );
        return id;
    };

    self.hoverover_cb = function ( el ) {
        self.fillOpacity = self.artwork.attr("fill-opacity");
        self.artwork.attr({"fill-opacity": 0.2});
        console.log(self.artwork.attr("fill-opacity"));
    }

    self.hoverout_cb = function ( el ) {
        self.artwork.attr({"fill-opacity": self.fillOpacity});
        console.log(self.artwork.attr("fill-opacity"));
    }

    self.click_cb = function() {
        io.send("msg", "Country click event: " + self.name);
    }

    self.sendDATA = function () {
        data = {
            id: self.id,
            name: self.name,
            continent: self.continent,
            owned: self.owned,
            armies: self.armies,
            boundary: self.boundary
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
