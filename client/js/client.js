var map = Snap("#map");
var io = new Socket( "http://127.0.0.1", "8080");
var countries = new Array();


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
    this.continent = "";
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

}


function Country () {
    this.id = "";
    this.continent = "";
    this.name = "";
    this.owned = Boolean;
    this.armies = 0;
    this.artwork = "";
    this.neighbour = new Array();
    this.fillOpacity = "";

    this.addNeighbour = function ( countryID ) {
        this.neighbour.push( countryID );
    };

    this.isNeighbour = function ( countryID ) {
        var idx = this.neighbour.indexOf ( countryID );
        return idx;
    };

    this.hoverover_cb = function ( el ) {
        this.fillOpacity = this.attr("fill-opacity");
        this.attr({"fill-opacity": 0.2});
    }

    this.hoverout_cb = function ( el ) {
        this.attr({"fill-opacity": this.fillOpacity});
    }

    this.click_cb = function( el ) {
        var c = this.node.id.split('-');
        var idx = c[1]+c[2];
        io.send( "msg", "Continent: " + countries[ idx ].continent +
                        " | Country: " + countries[ idx ].name +
                        " | Neighbour: " + countries[ idx ].neighbour
        );
    }

}

// Get map data...
var foo = Snap.load("../map/map_test.svg", function ( f ) {
    // id  : 0 = Country Artwork , 1 = Continent Name, 2 = Country Name
    // desc: n Country name
    var p = f.selectAll ( "path" );
    p.forEach(function ( el ) {
        var c = el.node.id.split("-");
        if (c[0] === "Country") {
            var idx = c[1]+c[2];
            countries[ idx ] = new Country();
            countries[ idx ].id = idx;
            countries[ idx ].continent = c[1];
            countries[ idx ].name = c[2].replace("_", " ");
            countries[ idx ].artwork = el;
            countries[ idx ].artwork.hover( countries[ idx ].hoverover_cb, countries[ idx ].hoverout_cb );
            countries[ idx ].artwork.click( countries[ idx ].click_cb );
            var d = el.select("desc").node.textContent.split("-");
            d.forEach(function(n) {
                countries[ idx ].addNeighbour(n);
            });
        }
        //if (c[0] === "Artwork") {
            console.log("All: " + c);
        //}
    });
    map.append( f );

} );
