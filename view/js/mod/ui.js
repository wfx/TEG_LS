/**
 * [description]
 * @param  {[object]} function(TC, undefined     [TC is the namespace (object)]
 * @return {[object]} [UI]
 */
TC.UI = (function(TC, undefined) {
  'use strict';

  var UI = {
    init: function() {
      UI.Scene.cacheElements();
      UI.Scene.bindEvents();
      UI.Observer = TC.Observer;
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
        UI.$doc.on('click', 'button[value="viewSceneStartup"]', TC.App.viewSceneStartup);
        UI.$doc.on('click', 'button[value="viewSceneHost"]', TC.App.viewSceneHost);
        UI.$doc.on('click', 'button[value="viewSceneJoin"]', TC.App.viewSceneJoin);
        UI.$doc.on('click', 'button[value="viewScenePlay"]', TC.App.viewScenePlay);
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

        UI.Infobar.player.update({
          "name": "[BOT]"
        });
      }
    },

    Infobar: {
      player: {
        update: function(p) {
          console.log(p.name);
          $(".player_type").html(p.type);
          $(".player_name").html(p.name);
          $(".player_name").css({
            "color": p.color
          });
          $(".player_info").html(p.info);
        }
      }
    },

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
              mouseClicked: TC.App.boardFieldClicked,
              mouseHoverOver: TC.App.boardFieldHoverOver,
              mouseHoverOut: TC.App.boardFieldHoverOut,
              mouseMove: TC.App.boardFieldMouseMove
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
  };

  return UI;

}(TC));
