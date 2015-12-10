var board = Snap("svg#map");
var boardName = "../map/map_test.svg";
var io = new Socket( "http://127.0.0.1", "8080");
var cont = new Array();  // Continent
var cnty = new Array();  // Country



// Socket...
function Socket ( server, port ) {
    var self = this;
    var socket = io.connect( server + ":" + port );

    socket.on("connect", function( data ) {
        socket.emit('join', 'CLIENT: Hi 5 server');
    });

    socket.on("msg", function(data) {
        switch(data) {
            case "cinfo":
                if (typeof contID != 'undefined') {
                    io.send("msg", "=== Continent data ===");
                    cont[ contID ].sendDATA();
                    io.send("msg", "=== Country data ===");
                    cont[ contID ].country.forEach(function ( countryID ){
                        cnty[ countryID ].sendDATA();
                    });
                }
                break;
            default:
                self.send("unknow query");
                break;
        }
    });

    self.send = function ( type, data ) {
        socket.emit(type, data);
    };
}

function Player () {
    var self = this;
    self.id = 0;
    self.name = "";
    self.human = false;
    self.country = new Array();
    self.cards = new Array();

    self.addCountry = function ( countryID ) {
        self.country.push( countryID );
        io.send( "msg", "add countryID " + countryID + "to player / id " + self.name + "/" + self.id );
    };

    self.rmCountry = function ( countryID ) {
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
    self.artwork = new Object();
    self.boundary = new Array();

    self.fillOpacity = "";  //  Store original fillOpacity -> hoveriver
    self.cntyInfo = new Object();  // infobox (name, armies)

    self.addBoundary = function ( countryID ) {
        self.boundary.push( countryID );
    };

    self.isBoundary = function ( countryID ) {
        var id = self.boundary.indexOf ( countryID );
        return id;
    };

    self.hoverover_cb = function ( el ) {
        // FIXME: opacity wont work becouse i have to select the path of the group (g)?
        // FIXME: .cx and .cy is wrong looks like the same as above?
        self.fillOpacity = self.artwork.attr("fill-opacity");
        self.artwork.attr({"fill-opacity": 0.2});
        x = self.artwork.getBBox().cx;  // cx is center of x
        y = self.artwork.getBBox().cy;  // cy is center of y
        self.cntyInfo = board.text( x, y, self.name );
        self.cntyInfo.attr({
            'font-weight': 'bold',
            'font-size': 16,
            'fill': '#fff'
        });
    }

    self.hoverout_cb = function ( el ) {
        self.artwork.attr({"fill-opacity": self.fillOpacity});
        self.cntyInfo.remove();
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
Snap.load( boardName, function ( f ) {
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

    board.append( f );
} );
