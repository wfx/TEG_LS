function Field() {
  "use strict";
  var self = this;
  self.id = "";
  self.name = "";
  self.area = "";
  self.owned = false;
  self._select = false;
  self.chip = 0;
  self.artwork = {};
  self.attrName = "";
  self.attrValue = "";
  self.attrOldValue = "";
  self.boundary = [];
  self.fieldInfo = {}; // infobox (name, chip, etc.)

  self.setArea = function ( idArea ) {
    self.area = idArea;
  }

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
    var json = {};
    json[ self.attrName ] = self.attrValue;
    self.artwork.attr( json );
    var x = self.artwork.getBBox().cx;
    var y = self.artwork.getBBox().cy;
    self.fieldInfo = board.text( x, y, self.name );
    self.fieldInfo.attr( {
      'font-weight': 'bold',
      'font-size': 16,
      'fill': '#fff'
    } );
  }

  self.onHoverout = function() {
    var json = {};
    json[ self.attrName ] = self.attrOldValue;
    self.artwork.attr( json );
    self.fieldInfo.remove();
  }

  self.onCick = function() {
    self.swichSelect();
    var data = {
      event: "click",
      idArea: self.continent,
      idField: self.id,
      chip: self.chip,
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

  self.chipPlace = function( n ) {
    n = Number( n );
    self.chip += n;
    return true;
  }

  self.chipRemove = function( n ) {
    n = Number( n );
    if ( self.chip > n ) {
      self.chip -= n;
      return true;
    } else {
      return false;
    }
  }

  self.getDATA = function() {
    data = {
      id: self.id,
      name: self.name,
      continent: self.continent,
      owned: self.owned,
      chip: self.chip,
      boundary: self.boundary,
      selcet: self._select
    }
    return data;
  }
}
