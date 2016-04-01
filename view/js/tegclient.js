jQuery(function($) {
  'use strict';

  var IO = {
      init: function() {
        IO.socket = io.connect();
        IO.bindEvents();
      },

      bindEvents: function() {
        IO.socket.on('connected', IO.onConnected);
        IO.socket.on('ts', IO.onTriggerState);
        IO.socket.on('message', IO.onMessage);
        IO.socket.on('error', IO.onGameError);
      },

      onConnected: function() {
        App.sessionId = IO.socket.sessionid;
        console.log('Client connected with id: ' + App.sessionId);
      },

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

      onMessage: function(data) {
        console.log('Message: ' + data);
      },

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

      /*  =======================================
          Server can call with: "ts command data"
          =======================================
       */
      bindState: function() {
        FSM.on('viewSceneStartup', UI.Scene.ViewSceneStartup);
        FSM.on('viewSceneHost', UI.Scene.ViewSceneHost);
        FSM.on('viewSceneJoin', UI.Scene.ViewSceneJoin);
        FSM.on('viewScenePlay', UI.Scene.ViewScenePlay);
        //
        FSM.on('field_select', UI.boardFieldClicked);
      },

      /*  ==================================
          Is needed then advising the server
          ==================================
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

      btnViewSceneJoinClick: function() {
        IO.socket.emit("advise", {
          name: "btnViewSceneJoin",
          value: "clicked"
        });
      },

      btnViewScenePlayClick: function() {
        IO.socket.emit("advise", {
          name: "btnViewScenePlay",
          value: "clicked"
        });
      },

      boardFieldClicked: function(fieldID) {
        IO.socket.emit("advise", {
          name: "field_clicked",
          value: fieldID
        });
        console.log(UI.Board.svgPoint);
      },
      boardFieldHoverOver: function(fieldID) {
        // give visual feedback
        UI.Board.map.field[fieldID].image.attr({
          "fill-opacity": ".5"
        });
      },
      boardFieldHoverOut: function(fieldID) {
        // give visual feedback
        UI.Board.map.field[fieldID].image.attr({
          "fill-opacity": "1"
        });
      },
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

        bindEvents: function() {
          // Html clickable stuff
          UI.$doc.on('click', '.btnViewSceneHost', App.btnViewSceneHostClick);
          UI.$doc.on('click', '.btnViewSceneJoin', App.btnViewSceneJoinClick);
          UI.$doc.on('click', '.btnViewScenePlay', App.btnViewScenePlayClick);
          // TODO: Menu and Dialog's
        },

        ViewSceneStartup: function(data) {
          UI.$gameArea.html(UI.$templateSceneStartup);
          // return true;
        },

        ViewSceneHost: function(data) {
          UI.$gameArea.html(UI.$templateSceneHost);
          // return true;
        },

        ViewSceneJoin: function(data) {
          UI.$gameArea.html(UI.$templateSceneJoin);
          // return true;
        },

        ViewScenePlay: function(data) {
          UI.$gameArea.html(UI.$templateScenePlay);
          $("playfield").css("background-image", "url(" + data.path + "/background.png)");
          // TODO: Menu..
          UI.Board.init(data);
          // return true;
        },

      },

      Menu: {},

      Dialog: {},

      Board: {
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

      Player: {
        // TODO: all... :)
      }
    },

    FSM = {};

  // run
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
