var tc = tc || {};
tc.client = new TEGClient();

function TEGClient() {
    "use strict";
    var elementBoard = document.getElementById("board"),
        svgPoint = elementBoard.createSVGPoint(),
        board = {},
        Mouse = {};

    // Init Socket
    var socket = io.connect("http://127.0.0.1:8080", {
        reconnection: true,
        forceNew: false
    });

    socket.once("connect", function() {
        socket.emit('authenticate', {
            game: "mygameid",
            player: "myplayername",
            token: "mytoken"
        });

        socket.on("message", function(msg) {
            console.log(msg);
        });
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
    // INIT: Finit State Machine
    var fsm = new EventStateMachine(
        "ready", {
            "ready": {
                "start": "play",
                "exit": "ready",
                "client_version": "ready",
                "set_game": "ready",
                "options": "ready",
                "error": "ready"
            },
            "play": {
                "get_field": "play",
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
                "get_field": "place",
                "field_select": "place",
                "set_field": "place",
                "place_done": "play",
                "error": "place"
            },
            "attac": {
                "get_field": "attac",
                "field_select": "attac",
                "attac": "attac",
                "attac_repeating": "attac",
                "attac_until": "attac",
                "attac_lose": "attac",
                "attac_won": "attac",
                "attac_done": "play",
                "set_owner": "attac",
                "error": "attac"
            },
            "move": {
                "get_field": "move",
                "field_select": "move",
                "move": "move",
                "move_done": "play",
                "error": "move"
            }
        }
    );

    var setGame = function(conf) {
        if (conf.path) {
            $("body").css("background-image", "url(" + conf.path + "/background.png)");

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

            board = new Board({
                element: document.getElementById("board"),
                file: conf.path + "/board.svg",
                viewBox: conf.viewBox,
                field: {
                    figures: conf.figures,
                    callbacks: {
                        clicked: eventFieldClicked,
                        hoverover: eventFieldHoverOver,
                        hoverout: eventFieldHoverOut,
                        mousemove: eventFieldMouseMove
                    }
                }
            });
            socket.emit("respond", true);
        }
    };
    /**
     * [eventFieldClicked
     *  This board event trigger the field click state]
     * @param  {[type]} uid [unique field id]
     */
    var eventFieldClicked = function(fieldID) {
        fsm.trigger("field_select", fieldID);
    };
    /**
     * [eventFieldHoverOver
     * 	This board event give a visiual feedback]
     * @param  {[type]} uid [unique field id]
     */
    var eventFieldHoverOver = function(fieldID) {
        board.field[fieldID].image.attr({
            "fill-opacity": ".5"
        });
    };
    /**
     * [boardFieldHoverOut
     * 	This board event give a visiual feedback]
     * @param  {[type]} uid [unique field id]
     */
    var eventFieldHoverOut = function(fieldID) {
        // give visiual feedback
        board.field[fieldID].image.attr({
            "fill-opacity": "1"
        });
    };
    /**
     * [boardFieldMouseMove
     * 	This board event is used to get mouse x and y coordinates]
     *
     * @param {[object]} Mouse event
     * @param {[string]} fieldID [unique field id]
     */
    var eventFieldMouseMove = function(ev, fieldID) {
        svgPoint.x = ev.clientX;
        svgPoint.y = ev.clientY;
        // Calculate Mouse.x and Mouse.y
        Mouse = svgPoint.matrixTransform(board.surface.node.getScreenCTM().inverse());
    };
    /**
     * [fieldSelect Server or Client trigger "field_select"]
     *
     * @param  {string} uid unique field id
     * @return {json}       emit field data to server (echo)
     */
    var fieldSelect = function(fieldID) {
        // Send field informations.
        socket.emit("echo", JSON.stringify({
            fieldID: board.field[fieldID].uID
        }));
        // TESTING START
        //board.field[uid].image.addClass("arrowPointer");

        var myCircle = board.surface.circle(Mouse.x, Mouse.y, 10);
        myCircle.attr({
            fill: "red",
            "pointer-events": "none"
        });

        board.group.add(myCircle);
        // TESTING END
    };
    /**
     * [setField Sever trigger "set_field"]
     *
     * @param  {json} fieldID:id,
     *         				figures:{NAME:value}
     */
    var setField = function(jData) {
        console.log(jData);
        if (jData.figure) {
            // yep slow but he we have max 3 figures :)
            Object.keys(jData.figure).forEach(function(key) {
                if (board.field[jData.fieldID].figure[key].owner) {
                    board.field[jData.fieldID].figure[key].owner = String(jData.owner[key]);
                }
                if (board.field[jData.fieldID].figure[key].amount) {
                    board.field[jData.fieldID].figure[key].amount += Number(jData.figure[key]);
                }
            });
        }
        if (jData.amount) {
            var f = [],
                remainder = 0,
                r = 0,
                a = jData.amount;

            Object.keys(board.field[jData.fieldID].figure).forEach(function(key) {
                f.push(board.field[jData.fieldID].figure[key].factor);
            });
            f = f.sort(function(a, b) {
                return b - a;
            });
            for (var i = 0; i < f.length; i++) {
                remainder = a % f[i];
                r = a - ((a - remainder) / f[i]) * f[i];
                console.log(a - r);
            }
        }
        socket.emit("respond", true);
    };

    var placeDone = function(fieldID) {
        if ($("#place").hasClass("w_show")) {
            $("#place").addClass("w_hide");
            $("#place").removeClass("w_show");
        }
        socket.emit("respond", true);
    };

    /**
     * [getField Sever trigger "get_field"]
     *
     * @param  {json} fieldID:id
     * @return {json} emit field data to server (receive)
     */
    var getField = function(jData) {
        jData = JSON.parse(jData);
        if (jData.fieldID) {
            var result = JSON.stringify({
                id: board.field[jData.fieldID].uID,
                boundary: board.field[jData.fieldID].boundary,
                areaID: board.field[jData.fieldID].areaID,
                quality: board.field[jData.fieldID].quality,
                selected: board.field[jData.fieldID].selected
            });
            console.log(JSON.stringify(board.field[jData.fieldID].figures));
            console.log(board.field[jData.fieldID]);
            socket.emit("receive", result);
        } else {
            socket.emit("tarzan", "country: need at least one ID");
            socket.emit("respond", true);
        }
        socket.emit("respond", true);
    };

    // TESTING
    fsm.log = true;

    // Bind trigger's on function
    fsm.on("set_game", setGame);
    fsm.on("field_select", fieldSelect);
    fsm.on("get_field", getField);
    fsm.on("set_field", setField);
    fsm.on("place_done", placeDone);
}
