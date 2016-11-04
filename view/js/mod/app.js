// COPYRIGHT (c) 2016 Wolfgang Morawetz
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

/**
 * [description]
 * @param  {[object]} function(TC, undefined     [TC is the namespace (object)]
 * @return {[object]} [App]
 */
TC.App = (function(TC, undefined) {
  'use strict';

  var App = {

    init: function(config) {
      App.bindState();
      App.gameId = 0;
      App.sessionId = '';
      App.activePlayer = 0;
    },
    /**
     * [Bind callback functions for each trigger.
     * The server can call it with: "ts trigger-name json-data"]
     */
    bindState: function() {
      TC.FSM.on('viewSceneStartup', TC.UI.Scene.viewStartup);
      TC.FSM.on('viewSceneHost', TC.UI.Scene.viewHost);
      TC.FSM.on('viewSceneJoin', TC.UI.Scene.viewJoin);
      TC.FSM.on('viewScenePlay', TC.UI.Scene.viewPlay);
      TC.FSM.on('dialogFieldInfoDisplay', TC.UI.Dialog.fieldInfo.display);

      TC.FSM.on('board_get_areas', TC.UI.Board.getAreas);

    },
    /**
     * [Trigger any FSM state (server side called over IO.onTriggerState) ]
     * @param  {[type]} trigger [description]
     * @param  {[type]} data    [description]
     * @return {[type]}         [description]
     */
    onTriggerState: function(trigger, data) {
      TC.FSM.trigger(trigger, data);
    },
    /**
     * [Advise server: view the "Startup" scene]
     */
    viewSceneStartup: function() {
      TC.IO.emit("advise", {
        name: "viewSceneStartup",
        value: "clicked"
      });
    },
    /**
     * [Advise server: view the "Host" scene]
     */
    viewSceneHost: function() {
      TC.IO.emit('hostCreateNewGame', {
        gameID: (Math.floor(Date.now() / 1000))
      });
      TC.IO.emit("advise", {
        name: "viewSceneHost",
        value: "clicked"
      });
    },

    /**
     * [Advise server: view the "Join" scene]
     */
    viewSceneJoin: function() {
      TC.IO.emit("advise", {
        name: "viewSceneJoin",
        value: "clicked"
      });
    },

    /**
     * [Advise server: view the "Play" scene]
     */
    viewScenePlay: function() {
      TC.IO.emit("advise", {
        name: "viewScenePlay",
        opt: {
          game: $('input[name=game]:checked').val()
        }
      });
    },

    /**
     * [Identify player action: Place, Transfer or Attack]
     * @param  {[string]} id [field ID]
     *
     * fieldA = selectedID &&
     * fieldB = selectedID
     *
     *
     */
    boardFieldClicked: function(id) {
      // select, deselect field
      // (true = !true : false / false = !false : true)
      TC.UI.Board.field[id].selected = !TC.UI.Board.field[id].selected;

      // log
      if (TC.UI.Board.field[id].selected) {
        console.log("field :" + TC.UI.Board.field[id].name + " is selected");
      } else {
        console.log("field :" + TC.UI.Board.field[id].name + " is not selected");
      }
      console.log("FieldA: " + TC.UI.Board.fieldA);
      console.log("FieldB: " + TC.UI.Board.fieldB);

      // spot player action:
      if (TC.UI.Board.fieldA === '') {
        TC.UI.Board.fieldA = id;
        // Player want to place some figures.
        if (Player.figuresToPlace > 0) {
          TC.IO.socket.emit("advise", {
            name: "place",
            fieldA: TC.UI.Board.fieldA
          });
        }
      } else {
        if (TC.UI.Board.fieldA === id) {
          TC.UI.Board.fieldA = '';
        } else {
          TC.UI.Board.fieldB = id;
          // Player want to transfer some figures.
          if (TC.UI.Board.field[TC.UI.Board.fieldB].owner === TC.Player[TC.App.activePlayer].id) {
            TC.IO.emit("advise", {
              name: "transfer",
              fieldA: App.UI.Board.fieldA,
              fieldB: App.UI.Board.fieldB
            });
          } else {
            // Player want to attac some opponent.
            TC.IO.emit("advise", {
              name: "attack",
              fieldA: TC.UI.Board.fieldA,
              fieldB: TC.UI.Board.fieldB
            });
          }
        }
      }
    },
    /**
     * [Give a visible feedback on mouse hover over]
     * @param  {[string]} fieldID [Field ID]
     */
    boardFieldHoverOver: function(id) {
      TC.UI.Board.field[id].img.attr({
        "fill-opacity": ".25"
      });
      TC.FSM.trigger("dialogFieldInfoDisplay", {
        value: true
      });
    },

    /**
     * [Give a visible feedback on mouse hover out]
     * @param  {[type]} fieldID [Field ID]
     */
    boardFieldHoverOut: function(id) {
      if (TC.UI.Board.field[id].selected === false) {
        TC.UI.Board.field[id].img.attr({
          "fill-opacity": "1"
        });
      }
      TC.FSM.trigger("dialogFieldInfoDisplay", {
        value: false
      });
    },

    /**
     * [To give information about the field where you have youre pointer]
     * @param  {[object]} ev      [Mouse event]
     * @param  {[string]} fieldID [Field ID]
     */
    boardFieldMouseMove: function(ev, id) {
      console.log(TC.UI.Board.field[id].name + ", Selected: " + TC.UI.Board.field[id].selected);
      TC.UI.Board.svgPoint.x = ev.clientX;
      TC.UI.Board.svgPoint.y = ev.clientY;
      // Calculate Mouse.x and Mouse.y
      TC.UI.Board.mouse = TC.UI.Board.svgPoint.matrixTransform(TC.UI.Board.field[id].img.node.getScreenCTM().inverse());
      // TODO: Check if we allways send good named data (to find bugs).
      TC.UI.Observer.update({
        fieldID: id
      });
    },
  };

  return App;

}(TC));
