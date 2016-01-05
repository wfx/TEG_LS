function Board(options) {
  "use strict";
  var self = this,
    area = {},
    field = {},
    file = options.file,
    viewbox = options.viewbox,
    surface = new Snap(options.element);

  // load the svg and fill up all map area's and field's
  Snap.load(options.file, function(map) {
    // TODO: get it from the map.
    surface.attr({
      viewBox: options.viewBox
    });
    var aid = "", // index var's for area and field.... :/
      fid = "";
    map.selectAll("g").forEach(function(el) {
      if (el.node.attributes["board:area"]) {
        aid = el.node.attributes["board:area"].value.replace(/ /g, "");
        area[aid] = new Area();
        area[aid].uID = aid;
        area[aid].name = el.node.attributes["board:area"].value;
        area[aid].quality = el.node.attributes["board:quality"].value;
      }
      if (el.node.attributes["board:field"]) {
        fid = area[aid].uID + el.node.attributes["board:field"].value.replace(/ /g, "");
        field[fid] = new Field(options.field);
        area[aid].field = fid;
        field[fid].uID = fid;
        field[fid].name = el.node.attributes["board:field"].value;
        field[fid].boundary = el.node.attributes["board:boundary"].value.split(",");
        field[fid].areaID = area[aid].uID;
        el.selectAll("path").forEach(function(el) {
          field[fid].image = el;
          // TODO: is bind right used?
          field[fid].image.hover(field[fid].onHoverOver, field[fid].onHoverOut);
          field[fid].image.click(field[fid].onClick);
        });
      }
    });
    surface.append(map);
  });

  self.getField = function(uID){
    if (uID) {
      return {
        id: uID,
        boundary: field[uID].boundary,
        areaID: field[uID].areaID,
        figure: field[uID].figure,
        quality: field[uID].quality,
        selected: field[uID].selected
      };
    }
    return false;
  };

}

function Area() {
  "use strict";
  var self = this;
  self.uID = "";
  self.name = "";
  self.quality = 0;
  self.field = [];
  self.image = {};
}

function Field(options) {
  "use strict";
  var self = this;
  self.uID = "";
  self.name = "";
  self.boundary = [];
  self.areaID = "";
  self.figure = {};
  self.quality = 0;
  self.image = {};
  self.selected = false;
  var clicked = options.callbacks.clicked,
    hoverover = options.callbacks.hoverover,
    hoverout = options.callbacks.hoverout;

  options.figures.forEach(function(t) {
    self.figure[t] = {
      owner: "",
      amount: ""
    };
  });

  var retData = function(){
    return {
        id: self.uID,
        boundary: self.boundary,
        areaID: self.areaID,
        figure: self.figure,
        quality: self.quality,
        selected: self.selected
    };
  };

  self.onClick = function() {
    //clicked(self);
    clicked(retData());
  };
  self.onHoverOver = function() {
    hoverover(retData());
  };
  self.onHoverOut = function() {
    hoverout(retData());
  };
}
