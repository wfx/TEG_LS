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
       * [Called on connection]
       * @return {[bool]} [Not yet implemented]
       */
      onConnected: function() {
        App.sessionId = IO.socket.sessionid;
        console.log('Client connected with id: ' + App.sessionId);
      },
      /**
       * [Server can trigger states, if none given then we return some actualy state informations]
       * @param  {[string]} trigger [Any trigger see tegclient.json]
       * @param  {[json]}   data    [optional json formated data]
       * @return {[bool]}           [Not yet implemented]
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
       * @return {[bool]}      [No yet implemented]
       */
      onMessage: function(data) {
        console.log('Message: ' + data);
      },
      /**
       * [Socket for any error (tarzan is an inside jocke)]
       * @param  {[json]} data [Json formated data]
       * @return {[bool]}      [No yet implemented]
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
       * @return {[bool]} [Not yet implemented]
       */
      bindState: function() {
        FSM.on('viewSceneStartup', UI.Scene.viewSceneStartup);
        FSM.on('viewSceneHost', UI.Scene.viewSceneHost);
        FSM.on('viewSceneJoin', UI.Scene.viewSceneJoin);
        FSM.on('viewScenePlay', UI.Scene.viewScenePlay);
        //
        FSM.on('field_select', UI.boardFieldClicked);
      },
      /**
       * [Advise server: view the "Host" scene]
       * @return {[bool]} [Not yet implemented]
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
       * @return {[bool]} [Not yet implemented]
       */
      btnViewSceneJoinClick: function() {
        IO.socket.emit("advise", {
          name: "btnViewSceneJoin",
          value: "clicked"
        });
      },
      /**
       * [Advise server: view the "Play" scene]
       * @return {[bool]} [Not yet implemented]
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
       * @return {[bool]} [Not yet implemented]
       */
      boardFieldClicked: function(fieldID) {
        IO.socket.emit("advise", {
          name: "field_clicked",
          value: fieldID
        });
        // INFO: Debug log.
        console.log("Field: " + fieldID + " at: " + UI.Board.svgPoint.x + "/" + UI.Board.svgPoint.y);
      },
      /**
       * [Give a visible feedback on mouse hover over]
       * @param  {[string]} fieldID [Field ID]
       * @return {[bool]} [Not yet implemented]
       */
      boardFieldHoverOver: function(fieldID) {
        UI.Board.map.field[fieldID].image.attr({
          "fill-opacity": ".5"
        });
      },
      /**
       * [Give a visible feedback on mouse hover out]
       * @param  {[type]} fieldID [Field ID]
       * @return {[bool]} [Not yet implemented]
       */
      boardFieldHoverOut: function(fieldID) {
        UI.Board.map.field[fieldID].image.attr({
          "fill-opacity": "1"
        });
      },
      /**
       * [To give information about the field where you have youre pointer]
       * @param  {[object]} ev      [Mouse event]
       * @param  {[string]} fieldID [Field ID]
       * @return {[bool]}           [Not yet implemented]
       */
      boardFieldMouseMove: function(ev, fieldID) {
        UI.Board.svgPoint.x = ev.clientX;
        UI.Board.svgPoint.y = ev.clientY;
        // Calculate Mouse.x and Mouse.y
        UI.Board.mouse = UI.Board.svgPoint.matrixTransform(UI.Board.map.surface.node.getScreenCTM().inverse());
      }
    },

    UI = {

      init: function() {
        UI.Scene.cacheElements();
        UI.Scene.bindEvents();
      },
      Scene: {
        /**
         * [Cache HTML elements that we use for scene view's]
         * @return {[bool]} [Not yet implemented]
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
         * @return {[bool]} [Not yet implemented]
         * TODO: Menu and Dialog's
         */
        bindEvents: function() {
          UI.$doc.on('click', '.btnViewSceneHost', App.btnViewSceneHostClick);
          UI.$doc.on('click', '.btnViewSceneJoin', App.btnViewSceneJoinClick);
          UI.$doc.on('click', '.btnViewScenePlay', App.btnViewScenePlayClick);
        },
        /**
         * [View scene Startup: The starting scene]
         * @return {[bool]} [Not yet implemented]
         */
        viewSceneStartup: function() {
          UI.$gameArea.html(UI.$templateSceneStartup);
        },
        /**
         * [View scene Host: Scene to setup and host a game]
         * @return {[bool]} [Not yet implemented]
         */
        viewSceneHost: function(data) {
          UI.$gameArea.html(UI.$templateSceneHost);
        },
        /**
         * [View scene Join: Scene to join a game]
         * @return {[bool]} [Not yet implemented]
         */
        viewSceneJoin: function(data) {
          UI.$gameArea.html(UI.$templateSceneJoin);
        },
        /**
         * [View scene Play: The Scene to playing a game]
         * @return {[bool]} [Not yet implemented]
         */
        viewScenePlay: function(data) {
          UI.$gameArea.html(UI.$templateScenePlay);
          $("playfield").css("background-image", "url(" + data.path + "/background.png)");
          UI.Board.init(data);
        },
      },
      Menu: {},
      Dialog: {},
      Board: {
        /**
         * [Load the game board]
         * @param  {[json]} data [configuration for the board (teg is view/game/teg/config.json)]
         * @return {[bool]}      [Not yet implemented]
         */
        init: function(data) {
          var map = {},
            mouse = {},
            svgPoint = {};

          UI.Board.map = new Board({
            element: document.getElementById("board"),
            file: data.path + "/board.svg",
            viewBox: data.viewBox,
            field: {
              figures: data.figures,
              callbacks: {
                clicked: App.boardFieldClicked,
                hoverover: App.boardFieldHoverOver,
                hoverout: App.boardFieldHoverOut,
                mousemove: App.boardFieldMouseMove
              }
            }
          });
          UI.Board.svgPoint = UI.Board.map.surface.node.createSVGPoint();
        },
      },
    },
    Player = {
      // TODO: all... :)
    },
    FSM = {};
  /**
   * [Initalize the client]
   * @param  {[json]} "js/tegclient.json" [load client configuration, init the client and inform the server]
   * @return {[bool]}                     [Not yet implemented]
   */
  $.getJSON("js/tegclient.json", function(json) {
    FSM = new EventStateMachine(json.start, json.transitions);
    IO.init();
    App.init();
    UI.init();
    IO.socket.emit("advise", {
      name: "state",
      value: "ready"
    });
  });
}($));
