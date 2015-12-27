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

  self.getDATA = function() {
    data = {
      id: self.id,
      name: self.name,
      quality: self.quality,
      country: self.country
    }
    return data;
  }
}
