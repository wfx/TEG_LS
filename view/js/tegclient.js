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
    console.log(cb.id);
  };

  var onFieldHoverOut = function(cb) {
    console.log(cb.id);
  };

  var socket = io.connect("http://127.0.0.1:8080");
  socket.on("connect", function(data) {
    socket.emit('message', 'ok, connected');
    socket.on("start", function(data) {
      console.log("receive start:\n" + data);
    });

    socket.on("client", function(data) {
      console.log("receive client:\n" + data);
    });

    socket.on("status", function(data) {
      console.log("receive status:\n" + data);
    });

    socket.on("message", function(data) {
      console.log("receive message:\n" + data);
    });

    socket.on("exit", function(data) {
      console.log("receive exit:\n" + data);
    });

    socket.on("cversion", function(data) {
      console.log("receive cversion:\n" + data);
    });

    socket.on("sversion", function(data) {
      console.log("receive sversion:\n" + data);
    });

    socket.on("pversion", function(data) {
      console.log("receive pversion:\n" + data);
    });

    socket.on("playerID", function(data) {
      console.log("receive playerID:\n" + data);
    });

    socket.on("help", function(data) {
      console.log("receive help:\n" + data);
    });

    socket.on("continent", function(data) {
      console.log("receive continent:\n" + data);
    });

    socket.on("country", function(data) {
      var result = board.getField(data.id);
      if(result) {
        socket.emit("echo", JSON.stringify(result));
      } else {
        // FIXME: client and not the server receive this message?
        socket.emit("error", "country: need at least one ID");
      }
    });

    socket.on("place", function(data) {
      console.log("receive place:\n" + data);
    });

    socket.on("remove", function(data) {
      console.log("receive remove:\n" + data);
    });

    socket.on("move", function(data) {
      console.log("receive move:\n" + data);
    });

    socket.on("attac", function(data) {
      console.log("receive attac:\n" + data);
    });

    socket.on("turn", function(data) {
      console.log("receive turn:\n" + data);
    });

    socket.on("exchange", function(data) {
      console.log("receive exchange:\n" + data);
    });

    socket.on("mission", function(data) {
      console.log("receive mission:\n" + data);
    });

    socket.on("color", function(data) {
      console.log("receive color:\n" + data);
    });

    socket.on("echo", function(data) {
      console.log("receive echo:\n" + data);
    });

    socket.on("surrender", function(data) {
      console.log("receive surrender:\n" + data);
    });

    socket.on("options", function(data) {
      console.log("receive options:\n" + data);
    });

    socket.on("robot", function(data) {
      console.log("receive robot:\n" + data);
    });

    socket.on("typeofgame", function(data) {
      console.log("receive typeofgame:\n" + data);
    });

    socket.on("error", function(data) {
      u.cout("receive error: %s", data);
    });
  });

  self.send = function(data) {
    // pass...
  };

  // load the svg map
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
