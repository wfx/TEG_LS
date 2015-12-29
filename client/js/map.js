function Map( arg ) {
	"use strict";
	/**
	 *  @class Map
	 *  @param surface: {string}
	 *  @param file: {number}
	 *  @param setViewBox: {object}
	 */
	var self = this,
		area = [], // Array of areainent object's
		field = [], // Array of country object's
		viewbox = ""; // if i just return the getViewBox result it is undefined?

	self.use = function() {
		Snap.load( arg.file, function( f ) {
			if ( arg.setViewBox === Object( arg.setViewBox ) ) {
				getViewBox( f );
				arg.setViewBox.attr( {
					viewBox: viewbox
				} );
			}
			parseMap( f );
			arg.surface.append( f );
		} );
	}

	var getViewBox = function( f ) {
		// TODO: it better... :/
		var v = f.selectAll( "svg" )
		v.forEach( function( el ) {
			if ( el.node.attributes[ "viewBox" ] ) {
				// !!! why i cant return this attribute value ??? !!!
				viewbox = el.node.attributes[ "viewBox" ].value;
			}
		} );
	}

	var parseMap = function( f ) {
		var idArea = "",
			idField = "",
			g = f.selectAll( "g" );

		g.forEach( function( el ) {
			if ( el.node.attributes[ "teg:continent" ] ) {
				// idArea = Area name with removed withespaces
				idArea = el.node.attributes[ "teg:continent" ].value.replace( / /g, '' );
				area[ idArea ] = new Area();
				area[ idArea ].id = idArea;
				area[ idArea ].name = el.node.attributes[ "teg:continent" ].value;
				area[ idArea ].quality = el.node.attributes[ "teg:quality" ].value;
			}
			if ( el.node.attributes[ "teg:country" ] ) {
				// idField = Area & Field name with removed withespaces
				idField = idArea + el.node.attributes[ "teg:country" ].value.replace( / /g, '' );
				field[ idField ] = new Field();
				field[ idField ].id = idField;
				field[ idField ].setArea( idArea );
				area[ idArea ].addField( idField );
				field[ idField ].name = el.node.attributes[ "teg:country" ].value;
				var boundary = el.node.attributes[ "teg:boundary" ].value.split( "," );
				boundary.forEach( function( n ) {
					field[ idField ].addBoundary( n );
				} );
				var aw = el.selectAll( "path" );
				aw.forEach( function( el ) {
					if ( el.node.attributes[ "teg:hover" ] ) {
						field[ idField ].artwork = el;
						field[ idField ].onHoverEffect( el.node.attributes[ "teg:hover" ].value.split( "," ) );
						// .hover and .click are snap.svg events
						field[ idField ].artwork.hover( field[ idField ].onHoverover,
							field[ idField ].onHoverout );
						field[ idField ].artwork.click( field[ idField ].onCick );
					}
				} );
			}
		} );
	}

	self.chipPlace = function( data ) {
		/**
		 *  @method chipRemove
		 *  Place chip's to a field
		 *  @param idField: {string}
		 *  @param chipAmount: {number}
		 *  @return {boolean}
		 */
		return field[ data.idField ].chipPlace( data.chipAmount );
	}

	self.chipRemove = function( data ) {
		/**
		 *  @method chipRemove
		 *  Remove chip's from a field
		 *  @param idField: {string}
		 *  @param chipAmount: {number}
		 *  @return {boolean}
		 */
		return field[ data.idField ].chipRemove( data.chipAmount );
	}

	self.chipMove = function( data ) {
		/**
		 *  @method chipMove
		 *  Move chip's from on field to any other
		 *  @param idFieldFrom: {string}
		 *  @param idFieldTo: {string}
		 *  @param chipAmount: {number}
		 *  @return {boolean}
		 */
		var d = ( {
			idField: data.idFieldFrom,
			chipAmount: data.chipAmount
		} );

		if ( self.chipRemove( d ) ) {
			var d = ( {
				idField: data.idFieldTo,
				chipAmount: data.chipAmount
			} );
			return self.chipPlace( d );
		}
		return false;
	}
}
