jQuery(function($) {
  'use strict';

  var IO = {
      init: function() {
        IO.socket = io.connect();
        IO.bindEvents();
      },

      /**
       * [Bind socket event's]
       * @return {[bool]} [Not yet implemented]
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
        console.log('Client connected with id: ' + App.sessionId);
      },

      /**
       * [Server can trigger states, if none given then we return some actualy state informations]
       * @param  {[string]} trigger [Any trigger see tegclient.json]
       * @param  {[json]}   data    [optional json formated data]
       */
      onTriggerState: function(trigger, data) {
        console.log('Server: trigger ' + trigger);
        if (trigger) {
          FSM.trigger(trigger, data);
        } else {
          var jData = [];
          jData.push(FSM.stateName);
          jData.push(FSM.currentState);
          IO.socket.emit("receive", JSON.stringify(jData));
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

    App = {
      gameId: 0,
      sessionId: '',
      init: function() {
        App.bindState();
      },

      /**
       * [Bind callback functions for each trigger.
       * The server can call it with: "ts trigger-name json-data"]
       */
      bindState: function() {
        FSM.on('viewSceneStartup', UI.Scene.viewSceneStartup);
        FSM.on('viewSceneHost', UI.Scene.viewSceneHost);
        FSM.on('viewSceneJoin', UI.Scene.viewSceneJoin);
        FSM.on('viewScenePlay', UI.Scene.viewScenePlay);
        //
        FSM.on('field_select', UI.boardFieldClicked);
        //
        FSM.on('dialogFieldInfoDisplay', UI.Dialog.fieldInfo.display);
      },

      /**
       * [Advise server: view the "Host" scene]
       */
      btnViewSceneHostClick: function() {
        IO.socket.emit('hostCreateNewGame', {
          gameID: (Math.floor(Date.now() / 1000))
        });
        IO.socket.emit("advise", {
          name: "btnViewSceneHost",
          value: "clicked"
        });
      },

      /**
       * [Advise server: view the "Join" scene]
       */
      btnViewSceneJoinClick: function() {
        IO.socket.emit("advise", {
          name: "btnViewSceneJoin",
          value: "clicked"
        });
      },

      /**
       * [Advise server: view the "Play" scene]
       */
      btnViewScenePlayClick: function() {
        IO.socket.emit("advise", {
          name: "btnViewScenePlay",
          value: "clicked"
        });
      },

      /**
       * [Advise server: field click]
       * @param  {[string]} fieldID [Field ID]
       */
      boardFieldClicked: function(fieldID) {
        IO.socket.emit("advise", {
          name: "field_clicked",
          value: fieldID
        });
      },

      /**
       * [Give a visible feedback on mouse hover over]
       * @param  {[string]} fieldID [Field ID]
       */
      boardFieldHoverOver: function(fieldID) {
        UI.Board.map.field[fieldID].image.attr({
          "fill-opacity": ".5"
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
        UI.Board.map.field[fieldID].image.attr({
          "fill-opacity": "1"
        });
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
        UI.Subject.update({
          fieldID: fieldID
        });
      }
    },

    UI = {

      init: function() {
        UI.Scene.cacheElements();
        UI.Scene.bindEvents();
        UI.Subject = Subject;
        UI.Subject.init();
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
          UI.$doc.on('click', '.btnViewSceneHost', App.btnViewSceneHostClick);
          UI.$doc.on('click', '.btnViewSceneJoin', App.btnViewSceneJoinClick);
          UI.$doc.on('click', '.btnViewScenePlay', App.btnViewScenePlayClick);
        },

        /**
         * [View scene Startup: The starting scene]
         */
        viewSceneStartup: function() {
          UI.$gameArea.html(UI.$templateSceneStartup);
        },

        /**
         * [View scene Host: Scene to setup and host a game]
         */
        viewSceneHost: function(data) {
          UI.$gameArea.html(UI.$templateSceneHost);
        },

        /**
         * [View scene Join: Scene to join a game]
         */
        viewSceneJoin: function(data) {
          UI.$gameArea.html(UI.$templateSceneJoin);
        },

        /**
         * [View scene Play: The Scene to playing a game]
         */
        viewScenePlay: function(data) {
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
              UI.Subject.attach(UI.Dialog.fieldInfo);
              UI.$dialogFieldInfo.addClass('w_show');
              UI.$dialogFieldInfo.removeClass('w_hide');

              UI.Board.foo.attr({
                "display": "inline-block",
                "z-index": "9"
              });

            } else {
              $("#playfield").css("cursor", "auto");
              UI.Subject.detach(UI.Dialog.fieldInfo);
              UI.$dialogFieldInfo.addClass('w_hide');
              UI.$dialogFieldInfo.removeClass('w_show');

              console.log(UI.Board);
              UI.Board.foo.attr({
                "display": "none"
              });

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
          var
            map = {},
            foo = {},
            mouse = {},
            svgPoint = {};

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
          console.log(UI.Board.map);
          UI.Board.svgPoint = UI.Board.map.surface.node.createSVGPoint();

          // Testing: Fieldinfo with svg image... not working. 
          Snap.load("img/landmark.svg", function(svgFile) {
            UI.Board.foo = svgFile;
            UI.Board.map.group.add(UI.Board.foo);
          });

        },
      },
    },

    Player = {
      // TODO: all... :)
    };

  /**
   * [IO comunicate with the server.
   * 	The UI have only functionality.
   * 	The App controll all depending on the game state.]
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
