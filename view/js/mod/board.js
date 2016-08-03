/**
 * [Board description: I'm totally unhappy with this (looks ugly and it is strange written)]
 * TODO: Rewrite it (maybe i put out all the map info from the svg into a json formated map file).
 * @type {Object}
 */
var Board = {
  /**
   * [Generate the board from an SVG artwork]
   * @param  {[type]} cfg [Configuration:
   *                       cfg.viewbox: The SVG viewport,
   *                       cfg.callback.mouseClicked:   callback mouse clicked,
   *                       cfg.callback.mouseHoverOver: callback mouse hover over,
   *                       cfg.callback.mouseHoverOut:  callback hover out,
   *                       cfg.callback.mouseMove:      callback mouse move (over field),
   *                       cfg.callback.keyPressed:     callback key pressed]
   */
  init: function(cfg) {
    //Board.vb = cfg.viewbox;
    Board.surface = new Snap(cfg.element);
    //Board.group = Board.surface.group();
    Board.area = {};
    Board.field = {};
    Board.surface.attr({
      viewBox: cfg.viewBox
    });
    Board.loadSVG(cfg);

  },
  loadSVG: function(cfg) {
    Snap.load(cfg.file, function(playfield) {
      var
        aid = "",  // area id (continent)
        fid = "";  // field id (country)

      playfield.selectAll('g').forEach(function(el) {
        if (el.node.attributes["board:area"]) {
          aid = el.node.attributes["board:area"].value.replace(/ /g, "");
          Board.area[aid] = {
            id: aid,
            name: el.node.attributes["board:area"].value,
            quality: el.node.attributes["board:quality"].value,
            fieldID: []
          };
        }
        if (el.node.attributes["board:field"]) {
          fid = aid + el.node.attributes["board:field"].value.replace(/ /g, "");
          cfg.field.areaID = aid;
          cfg.field.fieldID = fid;
          cfg.field.name = el.node.attributes["board:field"].value;
          cfg.field.boundary = el.node.attributes["board:boundary"].value.split(",");
          cfg.field.element = [];
          el.selectAll("path").forEach(function(el) {
            cfg.field.element.push(el);
          });
          Board.area[aid].fieldID.push(fid);
          Board.field[fid] = new Field(cfg.field);
        }
      });
      //console.log(Board);
      //Board.group.append(playfield);
      Board.surface.append(playfield.selectAll('defs'));
      Board.surface.append(playfield.selectAll('g'));
    });
  }
},
Field = function(cfg) {
  "use strict";
  var obj = {
    uID: cfg.fieldID,
    name: cfg.name,
    boundary: cfg.boundary,
    areaID: cfg.areaID,
    figure: {},
    quality: 0,
    image: {},
    selected: false,
    owner: '',
    cbMouseClick: cfg.callback.mouseClicked,
    cbMouseHoverOver: cfg.callback.mouseHoverOver,
    cbMouseHoverOut: cfg.callback.mouseHoverOut,
    cbMouseMove: cfg.callback.mouseMove,
    cbKeyPressed: cfg.callback.keyPressed,
    onMouseClick: function() {
      obj.cbMouseClick(obj.uID);
    },
    onMouseHoverOver: function() {
      obj.cbMouseHoverOver(obj.uID);
    },
    onMouseHoverOut: function() {
      obj.cbMouseHoverOut(obj.uID);
    },
    onMouseMove: function(ev) {
      obj.cbMouseMove(ev, obj.uID);
    },
    onKeyPressed: function(ev) {
      obj.cbKeyPressed(ev, obj.uID);
    }
  };

  var i = 0,
    len = 0;

  for (i in cfg.figure) {
    if (cfg.figure.hasOwnProperty(i)) {
      obj.figure[i] = {
        owner: "",
        amount: 0,
        factor: cfg.figure[i]
      };
    }
  }

  for (i = 0, len = cfg.element.length; i < len; i++) {
    obj.image = cfg.element[i];
    obj.image.click(obj.onMouseClick);
    obj.image.hover(obj.onMouseHoverOver, obj.onMouseHoverOut);
    obj.image.mousemove(obj.onMouseMove);
    //obj.image.keypressdown(obj.onKeyPressed);
  }

  return obj;

};
