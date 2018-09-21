// COPYRIGHT (c) 2016 Wolfgang Morawetz
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
      UI.Observer = new Observer();
      UI.Dialog.init();
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
      viewPlay: function(cfg) {
        UI.$gameArea.html(UI.$templateScenePlay);
        $("#playfield").css("background-image", "url(" + cfg.file.path + "background.png)");
        UI.Board.init(cfg);

        // Dialog: Field info:
        UI.Dialog.init();
        UI.Infobar.player.update();
      }
    },

    Infobar: {
      player: {
        update: function() {
          if (TC.Player[TC.App.activePlayer].human) {
            $(".player_type").html('');
          }
          $(".player_name").html(TC.Player[TC.App.activePlayer].name);
          $(".player_name").css({
            "color": TC.Player[TC.App.activePlayer].color
          });
          $(".player_info").html('');
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
          } else {
            $("#playfield").css("cursor", "auto");
            UI.Observer.detach(UI.Dialog.fieldInfo);
            UI.$dialogFieldInfo.addClass('hide');
            UI.$dialogFieldInfo.removeClass('show');
          }
        },

        update: function(data) {
          UI.$dialogFieldInfo.css({
            'top': UI.Board.svgPoint.y - 10,
            'left': UI.Board.svgPoint.x + 10,
          });
          UI.$dialogFieldInfo.html(UI.Board.field[data.fieldID].name);
        },
      }
    },

    Board: {
      /**
       * [Load the game board]
       * @param  {[json]} data [configuration for the board (teg is view/game/teg/config.json)]
       */
      init: function(cfg) {
        UI.Board.field = {};
        UI.Board.fieldA = '';
        UI.Board.fieldB = '';
        UI.Board.load(cfg);
      },
      load: function(cfg) {
        UI.Board.surface = new Snap('#board');
        // var dom,
        // filename = cfg.file.path + cfg.file.board;

        Snap.load(cfg.file.path + cfg.file.board, function(f) {
          // TODO: get viewBox from file.
          UI.Board.surface.attr({
            viewBox: "0 0 1880 1324",
            width: "100%",
            height: "100%"
          });
          for (var g in cfg.group) {
            for (var m in cfg.group[g].member) {
              console.log("Init: " + cfg.group[g].member[m].id);
              UI.Board.field[cfg.group[g].member[m].id] = new Field({
                id: cfg.group[g].member[m].id,
                name: cfg.group[g].member[m].name,
                img: f.select('#' + cfg.group[g].member[m].id),
                cbMouseClick: TC.App.boardFieldClicked,
                cbMouseHoverOver: TC.App.boardFieldHoverOver,
                cbMouseHoverOut: TC.App.boardFieldHoverOut,
                cbMouseMove: TC.App.boardFieldMouseMove
              });
            }
          }

          UI.Board.surface.append(f);
          UI.Board.svgPoint = UI.Board.surface.node.createSVGPoint();
          console.log(UI.Board.svgPoint);

        });
      }
    },
    getAreas: function(cb) {
      // TODO: send as JSON!
      cb(UI.Board.field);
    },
  };

  return UI;

}(TC));
