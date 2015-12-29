function UserInterface() {
  var self = this;
  self.place = function( data ) {
    /*
      @data: json
      cntyID: string,
      chipAmount: numeric
    */
    x = cnty[ data.cntyID ].artwork.getBBox().cx;
    y = cnty[ data.cntyID ].artwork.getBBox().cy;
    path = s.path( "M10 80 Q 95 10 180 80" ).attr( {
      fill: "none",
      stroke: "red",
      opacity: "1"
    } );
    playerChips.animate( 1000, mina.bounce );

  }

  self.remove = function( data ) {
    /*
      @data: json
      cntyID: string,
      chipAmount: numeric
    */
  }

  self.move = function( data ) {
    /*
      @data: json
      cntyIDR: string, // Remove from
      cntyIDP: string  // Place to
      chipAmount: numeric
    */
  }

  self.dice = function( data ) {
    /*
      @data: json
      diceAttac[n]: numeric // n depend on rules -> 0 to 2
      diceDefend[n]: numerc // n depend on rules -> 0 to 1
    */
  }
}
