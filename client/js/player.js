function Player() {
  var self = this;
  self.id = 0;
  self.continent = "";
  self.owned = false;
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
