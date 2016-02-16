var tc = tc || {};
tc.client = new TEGClient();

function TEGClient() {
  "use strict";
  var elementBoard = document.getElementById("board");
  var svgPoint = elementBoard.createSVGPoint();

  $("body").css("background-image", "url(map/bg_risk.png)");

  var fsm = new EventStateMachine(
    "ready", {
      "ready": {
        "server_down": "offline",
        "view_main": "main"
      },
      "offline": {
        "server_up": "ready"
      },
      "main": {
        "view_game": "gameplay"
      },
      "gameplay": {
        "data_country": "gameplay",
        "field_clicked": "gameplay",
        "server_down": "offline",
        "attac_country": "attac",
        "view_main": "main"
      },
      "attac": {
        "data_country": "gameplay",
        "attac_country": "attac",
        "attac_end": "gameplay"
      },
      "move": {
        "data_country": "gameplay",
        "move_armies": "move",
        "move_end": "gameplay"
      }
    }
  );
  // testing
  fsm.log = true;

  var onFieldClicked = function(uid) {
    fsm.trigger("field_clicked", uid);
  };

  var fieldClicked = function(uid) {
    // Send field informations.
    socket.emit("echo", JSON.stringify({
      id: board.field[uid].uID,
      boundary: board.field[uid].boundary,
      areaID: board.field[uid].areaID,
      figure: board.field[uid].figure,
      quality: board.field[uid].quality,
      selected: board.field[uid].selected
    }));
  };

  var onFieldHoverOver = function(uid) {
    // give visiual feedback
    board.field[uid].image.attr({
      "fill-opacity": ".5"
    });
  };

  var onFieldHoverOut = function(uid) {
    // give visiual feedback
    board.field[uid].image.attr({
      "fill-opacity": "1"
    });
  };

  var onFieldMouseMove = function() {
    // pass
  };

  /*
    Init Board
    TODO: Add more options (board:area etc.)
  */
  var board = new Board({
    element: document.getElementById("board"),
    file: "../map/map_test.svg",
    viewBox: "0 0 900 900",
    field: {
      figures: ["one", "five", "ten"],
      callbacks: {
        clicked: onFieldClicked,
        hoverover: onFieldHoverOver,
        hoverout: onFieldHoverOut,
        mousemove: onFieldMouseMove
      }
    }
  });

  /*
    Init socket
  */

  var sendCountryData = function(uid) {
    if (uid) {
      var result = JSON.stringify({
        id: board.field[uid].uID,
        boundary: board.field[uid].boundary,
        areaID: board.field[uid].areaID,
        figure: board.field[uid].figure,
        quality: board.field[uid].quality,
        selected: board.field[uid].selected
      });
      socket.emit("receive", result);
    } else {
      socket.emit("tarzan", "country: need at least one ID");
    }
  };

  var socket = io.connect("http://127.0.0.1:8080");
  socket.on("connect", function() {
    socket.emit('message', 'ok, connected');
    socket.on("state", function(state, data) {
      if (state) {
        fsm.trigger(state, data);
      } else {
        var jData = [];
        jData.push(fsm.stateName);
        jData.push(fsm.currentState);
        socket.emit("receive", JSON.stringify(jData));
      }
    });
  });

  fsm.on("data_country", sendCountryData);
  fsm.on("field_clicked", fieldClicked);

  fsm.trigger("view_main");
  fsm.trigger("view_game");

}
