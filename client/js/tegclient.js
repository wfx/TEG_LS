/**
 * The main namespace of TEG Client
 * @namespace
 * @name tc
 */
var tc = tc || {};
tc.client = new TEGClient();

function TEGClient() {
  "use strict";

  var onFieldClick = function(cb) {
    console.log(cb);
  };

  var onFieldHoverOver = function(cb) {
    console.log(cb.uID);
  };

  var onFieldHoverOut = function(cb) {
    console.log(cb.uID);
  };

  var server = io.connect("http://127.0.0.1:8080");
  server.on("connect", function(data) {
    server.emit('message', 'ok, connected');
    server.on("start", function(data) {
      console.log("get start:\n" + JSON.stringify(data));
    });

    server.on("client", function(data) {
      console.log("get client:\n" + JSON.stringify(data));
    });

    server.on("status", function(data) {
      console.log("get status:\n" + JSON.stringify(data));
    });

    server.on("message", function(data) {
      console.log("get message:\n" + JSON.stringify(data));
    });

    server.on("exit", function(data) {
      console.log("get exit:\n" + JSON.stringify(data));
    });

    server.on("cversion", function(data) {
      console.log("get cversion:\n" + JSON.stringify(data));
    });

    server.on("sversion", function(data) {
      console.log("get sversion:\n" + JSON.stringify(data));
    });

    server.on("pversion", function(data) {
      console.log("get pversion:\n" + JSON.stringify(data));
    });

    server.on("playerID", function(data) {
      console.log("get playerID:\n" + JSON.stringify(data));
    });

    server.on("help", function(data) {
      console.log("get help:\n" + JSON.stringify(data));
    });

    server.on("continents", function(data) {
      console.log("get continents:\n" + JSON.stringify(data));
    });

    server.on("countries", function(data) {
      console.log(board.getField(data.id));
      server.emit("echo", "jaja");
    });

    server.on("place", function(data) {
      console.log("get place:\n" + JSON.stringify(data));
    });

    server.on("remove", function(data) {
      console.log("get remove:\n" + JSON.stringify(data));
    });

    server.on("move", function(data) {
      console.log("get move:\n" + JSON.stringify(data));
    });

    server.on("attac", function(data) {
      console.log("get attac:\n" + JSON.stringify(data));
    });

    server.on("turn", function(data) {
      console.log("get turn:\n" + JSON.stringify(data));
    });

    server.on("exchange", function(data) {
      console.log("get exchange:\n" + JSON.stringify(data));
    });

    server.on("mission", function(data) {
      console.log("get mission:\n" + JSON.stringify(data));
    });

    server.on("color", function(data) {
      console.log("get color:\n" + JSON.stringify(data));
    });

    server.on("echo", function(data) {
      console.log("get echo:\n" + JSON.stringify(data));
    });

    server.on("surrender", function(data) {
      console.log("get surrender:\n" + JSON.stringify(data));
    });

    server.on("options", function(data) {
      console.log("get options:\n" + JSON.stringify(data));
    });

    server.on("robot", function(data) {
      console.log("get robot:\n" + JSON.stringify(data));
    });

    server.on("typeofgame", function(data) {
      console.log("get typeofgame:\n" + JSON.stringify(data));
    });
  });

  self.send = function(data) {
    // pass...
  };

  // This load the svg map, get
  board = new Board({
    element: "svg#board",
    file: "../map/map_test.svg",
    viewBox: "0 0 900 900",
    field: {
      figures: ["one", "five", "ten"],
      callbacks: {
        clicked: onFieldClick,
        hoverover: onFieldHoverOver,
        hoverout: onFieldHoverOut
      }
    }
  });
}
