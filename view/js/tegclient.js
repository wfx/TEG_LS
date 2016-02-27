var tc = tc || {};
tc.client = new TEGClient();

function TEGClient() {
  "use strict";
  var elementBoard = document.getElementById("board");
  var svgPoint = elementBoard.createSVGPoint();

  // TODO: Use css for each map.
  $("body").css("background-image", "url(map/bg_risk.png)");

  // Init Socket

  var socket = io.connect("http://127.0.0.1:8080",
  {
    reconnection: true,
    forceNew: true
  });
  socket.on("connect", function() {
    socket.emit('message', 'ok, connected');
    socket.on("ts", function(trigger, data) {
      if (trigger) {
        fsm.trigger(trigger, data);
      } else {
        var jData = [];
        jData.push(fsm.stateName);
        jData.push(fsm.currentState);
        socket.emit("receive", JSON.stringify(jData));
      }
    });
  });

  // Init Board

  /**
   * [boardFieldClicked
   *  This board event trigger the field click state]
   * @param  {[type]} uid [unique field id]
   */
  var boardFieldClicked = function(uid) {
    fsm.trigger("field_select", uid);
  };

  /**
   * [onFieldHoverOver
   * 	This board event give a visiual feedback]
   * @param  {[type]} uid [unique field id]
   */
  var boardFieldHoverOver = function(uid) {
    board.field[uid].image.attr({
      "fill-opacity": ".5"
    });
  };

  /**
   * [boardFieldHoverOut
   * 	This board event give a visiual feedback]
   * @param  {[type]} uid [unique field id]
   */
  var boardFieldHoverOut = function(uid) {
    // give visiual feedback
    board.field[uid].image.attr({
      "fill-opacity": "1"
    });
  };

  /**
   * [boardFieldMouseMove
   * 	This board event show field informations]
   *
   * @param  {[type]} uid [unique field id]
   */
  var boardFieldMouseMove = function() {
    // TODO: Write it.
  };

  /**
   * [Board models a board]
   *
   * TODO:
   * Add more options (board:area etc.).
   * Get from server: map file and figures.
   *
   * @param {[json]} Board definition
   * @param {[object]} HTML element
   * @param {[string]} File
   * @param {[string]} viewBox
   * @param {[json]} Field definition
   * @param {[string]} Array of figures
   * @param {[json]} callbacks
   * @param {[string]} clicked callback
   * @param {[string]} hover over callback
   * @param {[string]} hover out callback
   * @param {[string]} mouse move (over field) callback
   *
   */
  var board = new Board({
    element: document.getElementById("board"),
    file: "../map/map_test.svg",
    viewBox: "0 0 900 900",
    field: {
      figures: ["one", "five", "ten"],
      callbacks: {
        clicked: boardFieldClicked,
        hoverover: boardFieldHoverOver,
        hoverout: boardFieldHoverOut,
        mousemove: boardFieldMouseMove
      }
    }
  });

  // INIT: Finit State Machine

  var fsm = new EventStateMachine(
    "ready", {
      "ready": {
        "start": "play",
        "exit": "ready",
        "client_version": "ready",
        "type_of_game": "ready",
        "options": "ready",
        "error": "ready"
      },
      "play": {
        "field_data": "play",
        "field_select": "play",
        "place": "place",
        "attac": "attac",
        "move": "move",
        "card": "card",
        "game_lose": "ready",
        "game_won": "ready",
        "game_surrender": "ready",
        "save": "ready",
        "end_turn": "play",
        "error": "ready"
      },
      "card": {
        "card_get": "card",
        "card_trade": "card",
        "card_done": "play",
        "error": "play"
      },
      "place": {
        "field_data": "place",
        "field_select": "place",
        "place": "place",
        "place_done": "play",
        "error": "place"
      },
      "attac": {
        "field_data": "attac",
        "field_select": "attac",
        "attac": "attac",
        "attac_repeating": "attac",
        "attac_until": "attac",
        "attac_lose": "attac",
        "attac_won": "attac",
        "attac_done": "play",
        "error": "attac"
      },
      "move": {
        "field_data": "move",
        "field_select": "move",
        "move": "move",
        "move_done": "play",
        "error": "move"
      }
    }
  );

  /**
   * [stateFieldSelect Called on state NAME]
   *
   * @param  {string} uid unique field id
   * @return {json}       emit field data to server (echo)
   */
  var stateFieldSelect = function(uid) {
    // Send field informations.
    socket.emit("echo", JSON.stringify({
      fieldID: board.field[uid].uID
    }));
  };

  /**
   * [statePlaceFigure	Called on state NAME]
   *
   * @param  {string} uid unique field id
   */
  var statePlaceFigure = function(uid) {
    $("#place").addClass("foo");
  };

  /**
   * [stateFieldData Sever trigger state NAME]
   *
   * @param  {string} uid unique field id
   * @return {json}       emit field data to server (receive)
   */
  var stateFieldData = function(data) {
    if (data.fieldID) {
      var result = JSON.stringify({
        id: board.field[data.fieldID].uID,
        boundary: board.field[data.fieldID].boundary,
        areaID: board.field[data.fieldID].areaID,
        figure: board.field[data.fieldID].figure,
        quality: board.field[data.fieldID].quality,
        selected: board.field[data.fieldID].selected
      });
      socket.emit("receive", result);
    } else {
      socket.emit("tarzan", "country: need at least one ID");
    }
  };

  // Testing
  fsm.log = true;

  fsm.on("field_select", stateFieldSelect);
  fsm.on("field_data", stateFieldData);
  fsm.on("place_figure", statePlaceFigure);

}
