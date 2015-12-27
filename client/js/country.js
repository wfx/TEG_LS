function Country() {
  var self = this;
  self.id = "";
  self.name = "";
  self.continent = "";
  self.owned = false;
  self._select = false;
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

  self.onHoverEffect = function( data ) {
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
  }

  self.onHoverout = function() {
    json = {};
    json[ self.attrName ] = self.attrOldValue;
    self.artwork.attr( json );
    self.cntyInfo.remove();
  }

  self.onCick = function() {
    self.swichSelect();
    data = {
            event: "click",
            contID: self.continent,
            cntyID: self.id,
            armies: self.armies,
            select: self.select
          };
    io.send( "event", data );
  }

  self.swichSelect = function() {
    if ( self._select ) {
      self._select = false;
    } else {
      self._select = true;
    }
    return self._select;
  }

  self.setSelect = function( b ) {
    self._select = b;
    return self._select;
  }

  self.isSelect = function() {
    return self._select;
  }

  self.setArmies = function( n ) {
    // n can be negative or positive
    return self.armies += Number( n );
  }

  self.getDATA = function() {
    data = {
      id: self.id,
      name: self.name,
      continent: self.continent,
      owned: self.owned,
      armies: self.armies,
      boundary: self.boundary
    }
    return data;
  }
}
