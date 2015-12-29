function Area() {
  "use strict";
	/**
	 *  @class Area
   *  Models a area like continents in teg
	 *  @param id {string}
   *  @param name {string}
   *  @param quality {number}
   *  Set the quality of this area ( like continets in teg :)
   *  @param field {array}
   *  An area can have on or more field's ( like the countries in teg )
	 */
  var self = this;
  self.id = "";
  self.name = "";
  self.quality = 0;
  self.field = [];
  self.artwork = {};

  self.addField = function( idField ) {
    self.field.push( idField );
  };

  self.isField = function( idField ) {
    return self.field.indexOf( idField );
  };

  self.getDATA = function() {
    /**
     *  @method getDATA
     *  @return {json}
     *  @param id {string}
     *  @param name {string}
     *  @param quality {number}
     *  @param field {array}
     */
    data = {
      id: self.id,
      name: self.name,
      quality: self.quality,
      field: self.field
    }
    return data;
  }
}
