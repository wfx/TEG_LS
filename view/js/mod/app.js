TC.App = (function(TC, undefined) {
  'use strict';

  var App = {

    init: function(config) {
      App.bindState();
      App.gameId = 0;
      App.sessionId = '';
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
        value: "clicked"
      });
    },

    /**
     * [Identify player action: Place, Transfer or Attack]
     * @param  {[type]} fieldID [field ID]
     */
    boardFieldClicked: function(fieldID) {
      // select or deselect field
      if (TC.UI.Board.map.field[fieldID].selected) {
        TC.UI.Board.map.field[fieldID].selected = false;
      } else {
        TC.UI.Board.map.field[fieldID].selected = true;
        if (TC.UI.Board.selectedField == fieldID);
        TC.UI.Board.selectedField = fieldID;
      }
      // player action:
      if (TC.UI.Board.fieldA === '') {
        TC.UI.Board.fieldA = fieldID;
        TC.UI.Board.map.field[TC.UI.Board.fieldA].selected = true;
        // Player want to place some figures.
        if (Player.figuresToPlace > 0) {
          TC.IO.socket.emit("advise", {
            name: "place",
            fieldA: TC.UI.Board.fieldA
          });
        }
      } else {
        if (TC.UI.Board.fieldA === fieldID) {
          TC.UI.Board.fieldA = '';
          TC.UI.Board.map.field[fieldID].selected = false;
        } else {
          TC.UI.Board.fieldB = fieldID;
          TC.UI.Board.map.field[TC.UI.Board.fieldB].selected = true;
          // Player want to transfer some figures.
          if (TC.UI.Board.map.field[TC.UI.Board.fieldB].owner === Player.id) {
            TC.IO.socket.emit("advise", {
              name: "transfer",
              fieldA: App.UI.Board.fieldA,
              fieldB: App.UI.Board.fieldB
            });
          } else {
            // Player want to attac some opponent.
            TC.IO.socket.emit("advise", {
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
    boardFieldHoverOver: function(fieldID) {
      TC.UI.Board.map.field[fieldID].image.attr({
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
    boardFieldHoverOut: function(fieldID) {
      if (TC.UI.Board.map.field[fieldID].selected === false) {
        TC.UI.Board.map.field[fieldID].image.attr({
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
    boardFieldMouseMove: function(ev, fieldID) {
      TC.UI.Board.svgPoint.x = ev.clientX;
      TC.UI.Board.svgPoint.y = ev.clientY;
      // Calculate Mouse.x and Mouse.y
      TC.UI.Board.mouse = TC.UI.Board.svgPoint.matrixTransform(TC.UI.Board.map.surface.node.getScreenCTM().inverse());
      TC.UI.Observer.update({
        fieldID: fieldID
      });
    },
  };

  return App;

}(TC));
