jQuery(function($) {
  'use strict';

  /**
   * Entry point:
   * 	Client send (socket) "advise" -> "ready".
   * 	Server trigger state -> "viewSceneStartup".
   * 	User hase now the choice to "Host" or "Join" a game.
   * 	...
   *
   * Communication:
   * 	Server -> Client;
   * 	Use socket connection "ts" (trigger state).
   * 	The available triggers/state are defined in tegclient.json.
   * 	TODO: Rename tegcient.json
   *
   *  Client -> Server;
   *  Use FSM and via the FSM.on defined callback's it use the socket connections.
   *  Client change nothing and ask allways the sever over socket "advise" and the
   *  server check the advise (allow/disallow) and do the changes.
   *
   * 	Client -> Client;
   * 	All not game realted events are done client side (hover effect's etc.).
   * 	Use FSM and run the defined callback functions.
   *
   */

  var IO = {
      init: function() {
        IO.socket = io.connect();
        IO.bindEvents();
      },

      /**
       * [Bind socket event's]
       */
      bindEvents: function() {
        IO.socket.on('connected', IO.onConnected);
        IO.socket.on('ts', IO.onTriggerState);
        IO.socket.on('message', IO.onMessage);
        IO.socket.on('error', IO.onGameError);
      },

      /**
       * [Called on server connection]
       */
      onConnected: function() {
        App.sessionId = IO.socket.sessionid;
        console.log('Client: Client connected with id: ' + App.sessionId);
      },

      /**
       * [Server can trigger states, if none given then return actualy state and triggers]
       * @param  {[string]} trigger [Any trigger see tegclient.json]
       * @param  {[json]}   data    [optional json formated data]
       */
      onTriggerState: function(trigger, data) {
        console.log('Server: trigger ' + trigger);
        if (trigger) {
          App.onTriggerState(trigger, data);
        } else {
          var jData = [];
          jData.push(FSM.stateName);
          jData.push(FSM.currentState);
          IO.socket.emit("message", JSON.stringify(jData));
        }
      },

      /**
       * [Socket for chating messages, not yet implemented]
       * @param  {[json]} data [Json formated data]
       */
      onMessage: function(data) {
        console.log('Message: ' + data);
      },

      /**
       * [Socket for any error (tarzan is an inside jocke)]
       * @param  {[json]} data [Json formated data]
       */
      onGameError: function(data) {
        console.log('Tarzan! Error: ' + data);
      }
    },

    FSM = FinitStateMachine,

    App = {

      init: function() {
        App.bindState();
        App.gameId = 0;
        App.sessionId = '';
      },
      /**
       * [Bind callback functions for each trigger.
       * The server can call it with: "ts trigger-name json-data"]
       */
      bindState: function() {
        FSM.on('viewSceneStartup', UI.Scene.viewStartup);
        FSM.on('viewSceneHost', UI.Scene.viewHost);
        FSM.on('viewSceneJoin', UI.Scene.viewJoin);
        FSM.on('viewScenePlay', UI.Scene.viewPlay);
        FSM.on('dialogFieldInfoDisplay', UI.Dialog.fieldInfo.display);

        FSM.on('board_get_areas', UI.Board.getAreas);

      },
      /**
       * [Trigger any FSM state (server side called over IO.onTriggerState) ]
       * @param  {[type]} trigger [description]
       * @param  {[type]} data    [description]
       * @return {[type]}         [description]
       */
      onTriggerState: function(trigger, data) {
        FSM.trigger(trigger, data);
      },
      /**
       * [Advise server: view the "Startup" scene]
       */
      viewSceneStartup: function() {
        IO.socket.emit("advise", {
          name: "viewSceneStartup",
          value: "clicked"
        });
      },
      /**
       * [Advise server: view the "Host" scene]
       */
      viewSceneHost: function() {
        IO.socket.emit('hostCreateNewGame', {
          gameID: (Math.floor(Date.now() / 1000))
        });
        IO.socket.emit("advise", {
          name: "viewSceneHost",
          value: "clicked"
        });
      },

      /**
       * [Advise server: view the "Join" scene]
       */
      viewSceneJoin: function() {
        IO.socket.emit("advise", {
          name: "viewSceneJoin",
          value: "clicked"
        });
      },

      /**
       * [Advise server: view the "Play" scene]
       */
      viewScenePlay: function() {
        IO.socket.emit("advise", {
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
        if (UI.Board.map.field[fieldID].selected) {
          UI.Board.map.field[fieldID].selected = false;
        } else {
          UI.Board.map.field[fieldID].selected = true;
          if (UI.Board.selectedField == fieldID);
          UI.Board.selectedField = fieldID;
        }
        // player action:
        if (UI.Board.fieldA === '') {
          UI.Board.fieldA = fieldID;
          UI.Board.map.field[UI.Board.fieldA].selected = true;
          // Player want to place some figures.
          if (Player.figuresToPlace > 0) {
            IO.socket.emit("advise", {
              name: "place",
              fieldA: UI.Board.fieldA
            });
          }
        } else {
          if (UI.Board.fieldA === fieldID) {
            UI.Board.fieldA = '';
            UI.Board.map.field[fieldID].selected = false;
          } else {
            UI.Board.fieldB = fieldID;
            UI.Board.map.field[UI.Board.fieldB].selected = true;
            // Player want to transfer some figures.
            if (UI.Board.map.field[UI.Board.fieldB].owner === Player.id) {
              IO.socket.emit("advise", {
                name: "transfer",
                fieldA: UI.Board.fieldA,
                fieldB: UI.Board.fieldB
              });
            } else {
              // Player want to attac some opponent.
              IO.socket.emit("advise", {
                name: "attack",
                fieldA: UI.Board.fieldA,
                fieldB: UI.Board.fieldB
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
        UI.Board.map.field[fieldID].image.attr({
          "fill-opacity": ".25"
        });
        FSM.trigger("dialogFieldInfoDisplay", {
          value: true
        });
      },

      /**
       * [Give a visible feedback on mouse hover out]
       * @param  {[type]} fieldID [Field ID]
       */
      boardFieldHoverOut: function(fieldID) {
        if (UI.Board.map.field[fieldID].selected === false) {
          UI.Board.map.field[fieldID].image.attr({
            "fill-opacity": "1"
          });
        }
        FSM.trigger("dialogFieldInfoDisplay", {
          value: false
        });
      },

      /**
       * [To give information about the field where you have youre pointer]
       * @param  {[object]} ev      [Mouse event]
       * @param  {[string]} fieldID [Field ID]
       */
      boardFieldMouseMove: function(ev, fieldID) {
        UI.Board.svgPoint.x = ev.clientX;
        UI.Board.svgPoint.y = ev.clientY;
        // Calculate Mouse.x and Mouse.y
        UI.Board.mouse = UI.Board.svgPoint.matrixTransform(UI.Board.map.surface.node.getScreenCTM().inverse());
        UI.Observer.update({
          fieldID: fieldID
        });
      }
    },

    UI = {

      init: function() {
        UI.Scene.cacheElements();
        UI.Scene.bindEvents();
        UI.Observer = Observer;
        UI.Observer.init();
      },

      Scene: {
        /**
         * [Cache Scenes]
         */
        cacheElements: function() {
          UI.$doc = $(document);
          // The place to View scene's.
          UI.$gameArea = $('#gameArea');
          // View scene's.
          UI.$templateSceneStartup = $('#Scene-Startup').html();
          UI.$templateSceneHost = $('#Scene-Host').html();
          UI.$templateSceneJoin = $('#Scene-Join').html();
          UI.$templateScenePlay = $('#Scene-Play').html();
        },

        /**
         * [Bind clickable HTML elements (button's etc.)]
         * TODO: Menu and Dialog's
         */
        bindEvents: function() {
          UI.$doc.on('click', 'button[value="viewSceneStartup"]', App.viewSceneStartup);
          UI.$doc.on('click', 'button[value="viewSceneHost"]', App.viewSceneHost);
          UI.$doc.on('click', 'button[value="viewSceneJoin"]', App.viewSceneJoin);
          UI.$doc.on('click', 'button[value="viewScenePlay"]', App.viewScenePlay);
        },

        /**
         * [View scene Startup: The starting scene]
         */
        viewStartup: function() {
          UI.$gameArea.html(UI.$templateSceneStartup);
        },

        /**
         * [View scene Host: Scene to setup and host a game]
         */
        viewHost: function(data) {
          UI.$gameArea.html(UI.$templateSceneHost);
        },

        /**
         * [View scene Join: Scene to join a game]
         */
        viewJoin: function(data) {
          UI.$gameArea.html(UI.$templateSceneJoin);
        },

        /**
         * [View scene Play: The Scene to playing a game]
         */
        viewPlay: function(data) {
          UI.$gameArea.html(UI.$templateScenePlay);
          $("#playfield").css("background-image", "url(" + data.path + "/background.png)");
          UI.Board.init(data);

          // Dialog: Field info:
          UI.Dialog.init();
        },
      },

      Menu: {},

      Dialog: {
        init: function() {
          UI.Dialog.cacheElements();
        },

        cacheElements: function() {
          UI.$dialogFieldInfo = $('#dialog-fieldinfo');
        },

        fieldInfo: {

          display: function(data) {
            if (data.value) {
              $("#playfield").css("cursor", "pointer");
              UI.Observer.attach(UI.Dialog.fieldInfo);
              UI.$dialogFieldInfo.addClass('show');
              UI.$dialogFieldInfo.removeClass('hide');

              //UI.Board.map.surface.before(UI.Board.foo);

            } else {
              $("#playfield").css("cursor", "auto");
              UI.Observer.detach(UI.Dialog.fieldInfo);
              UI.$dialogFieldInfo.addClass('hide');
              UI.$dialogFieldInfo.removeClass('show');

              //UI.Board.map.surface.after(UI.Board.foo);

            }
          },

          update: function(data) {
            UI.$dialogFieldInfo.css({
              'top': UI.Board.svgPoint.y - 10,
              'left': UI.Board.svgPoint.x + 10,
            });
            UI.$dialogFieldInfo.html(UI.Board.map.field[data.fieldID].name);
          },
        }
      },

      Board: {
        /**
         * [Load the game board]
         * @param  {[json]} data [configuration for the board (teg is view/game/teg/config.json)]
         */
        init: function(data) {
          UI.Board.fieldA = '';
          UI.Board.fieldB = '';
          UI.Board.map = Board;
          UI.Board.map.init({
            element: document.getElementById("board"),
            file: data.path + "/board.svg",
            viewBox: data.viewBox,
            field: {
              figure: data.figures,
              callback: {
                mouseClicked: App.boardFieldClicked,
                mouseHoverOver: App.boardFieldHoverOver,
                mouseHoverOut: App.boardFieldHoverOut,
                mouseMove: App.boardFieldMouseMove
              }
            }
          });
          UI.Board.svgPoint = UI.Board.map.surface.node.createSVGPoint();
        },
        getAreas: function(cb) {
          // TODO: send JSON data!!!
          var obj = UI.Board.map;

          Object.keys(obj).forEach(function(prop) {
            if (obj.hasOwnProperty(prop)) {
              console.log(obj[prop]);
            }
          });

          cb(UI.Board.map.field);
        },
      },
    },

    Player = {
      init: function() {
        // TESTING
        Player.name = "Anonymous";
        Player.id = 1;
        Player.figuresToPlace = 0;
      }
    };

  /**
   * [IO configure the comunicate with the server.
   * 	The UI have only functionality.
   * 	The App controll all depending on the game state and talk with the server.]
   * @param  {[json]} "js/tegclient.json" [load client configuration, init the client and inform the server]
   */
  $.getJSON("js/tegclient.json", function(json) {
    FSM.init(json.start, json.transitions);

    IO.init();

    App.init();

    UI.init();

    IO.socket.emit("advise", {
      name: "state",
      value: "ready"
    });

  });
}($));
