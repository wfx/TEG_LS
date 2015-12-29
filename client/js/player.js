function Player() {
  var self = this;
  self.id = 0;  // it's the player numberit's the player number
  self.name = ""; // a string chosen by the player
  self.icon = "";
  self.color = "#bada55"; // a string or number corresponding to the color chosen by the player
  self.score = ""; // score of the player
  self.misson = ""; // number corresponding to the mission to achieve if the mode chosen is "traditional-missions"
  self.armies = ""; // the number of armies available for the player
  self.continent = ""; // an array with the id's of the continets owned by the player
  self.countries = []; // an array with the id's of the countries owned by the player
  self.cards = []; // an array with card ids
  self.turn = false; // player hase turn
  self.type = 0; // None, Human, Bot_Easy, Bot_Hard, Bot_Extreme as int value (0..4)
  self.chipOne = {} // SVG artwork for chip value owned

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
