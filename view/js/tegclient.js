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
    };

    var App = {

        gameId: 0,
        sessionId: '',

        init: function() {
            App.cacheElements();
            App.bindEvents();
            App.bindState();
            IO.socket.emit("advise", {
                name: "state",
                value: "ready"
            });
        },

        cacheElements: function() {
            App.$doc = $(document);
            // The place to View scene's.
            App.$gameArea = $('#gameArea');
            // View scene's.
            App.$templateSceneStartup = $('#Scene-Startup').html();
            App.$templateSceneHost = $('#Scene-Host').html();
            App.$templateSceneJoin = $('#Scene-Join').html();
            App.$templateScenePlay = $('#Scene-Play').html();
        },

        bindEvents: function() {
            // Html clickable stuff
            App.$doc.on('click', '#btnViewSceneHost', App.onViewSceneHostClick);
            App.$doc.on('click', '#btnViewSceneJoin', App.onViewSceneJoinClick);
            App.$doc.on('click', '#btnViewScenePlay', App.onViewScenePlayClick);
        },

        bindState: function() {
            // Everythink is controlled on server side (ts, whatever, json data)
            FSM.on('viewSceneStartup', App.ViewSceneStartup);
            FSM.on('viewSceneHost', App.ViewSceneHost);
            FSM.on('viewSceneJoin', App.ViewSceneJoin);
            FSM.on('viewScenePlay', App.ViewScenePlay);
            //
            FSM.on('field_select', App.fieldClicked);
        },

        ViewSceneStartup: function(data) {
            App.$gameArea.html(App.$templateSceneStartup);
            // return true;
        },

        ViewSceneHost: function(data) {
            App.$gameArea.html(App.$templateSceneHost);
            // return true;
        },

        ViewSceneJoin: function(data) {
            App.$gameArea.html(App.$templateSceneJoin);
            // return true;
        },

        ViewScenePlay: function(data) {
            App.$gameArea.html(App.$templateScenePlay);
            App.Board.init(data);
            // return true;
        },

        // Advising the server:
        // ====================
        onViewSceneHostClick: function() {
            IO.socket.emit('hostCreateNewGame', {
                gameID: (Math.floor(Date.now() / 1000))
            });
            IO.socket.emit("advise", {
                name: "btnViewSceneHost",
                value: "clicked"
            });
        },
        onViewSceneJoinClick: function() {
            IO.socket.emit("advise", {
                name: "btnViewSceneJoin",
                value: "clicked"
            });
        },
        onViewScenePlayClick: function() {
            IO.socket.emit("advise", {
                name: "btnViewScenePlay",
                value: "clicked"
            });
        },

        /*
            DRAW THE BOAD and inform the server on field event's
            Event: fieldClicked
        */
        Board: {
            init: function(data) {
                var map = {},
                    mouse = {},
                    svgPoint = {};

                $("body").css("background-image", "url(" + data.path + "/background.png)");
                App.Board.map = new Board({
                    element: document.getElementById("board"),
                    file: data.path + "/board.svg",
                    viewBox: data.viewBox,
                    field: {
                        figures: data.figures,
                        callbacks: {
                            clicked: App.Board.fieldClicked,
                            hoverover: App.Board.fieldHoverOver,
                            hoverout: App.Board.fieldHoverOut,
                            mousemove: App.Board.fieldMouseMove
                        }
                    }
                });
                App.Board.svgPoint = App.Board.map.surface.node.createSVGPoint();
            },
            fieldClicked: function(fieldID) {
                IO.socket.emit("advise", {
                    name: "field_clicked",
                    value: fieldID
                });
                console.log(App.Board.svgPoint);
            },
            fieldHoverOver: function(fieldID) {
                // give visual feedback
                App.Board.map.field[fieldID].image.attr({
                    "fill-opacity": ".5"
                });
            },
            fieldHoverOut: function(fieldID) {
                // give visual feedback
                App.Board.map.field[fieldID].image.attr({
                    "fill-opacity": "1"
                });
            },
            fieldMouseMove: function(ev, fieldID) {
                App.Board.svgPoint.x = ev.clientX;
                App.Board.svgPoint.y = ev.clientY;
                // Calculate Mouse.x and Mouse.y
                App.Board.mouse = App.Board.svgPoint.matrixTransform(App.Board.map.surface.node.getScreenCTM().inverse());
            }
        },

        Player: {
            // TODO: all... :)
        }
    };

    var FSM = {};
    $.getJSON("js/tegclient.json", function(json) {
        FSM = new EventStateMachine(json.start, json.transitions);
        IO.init();
        App.init();
    });

}($));
