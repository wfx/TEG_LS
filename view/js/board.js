function Board(opt) {
    "use strict";
    var self = this,
        map = {},
        viewbox = opt.viewbox;

    self.area = [];
    self.field = [];
    self.surface = new Snap(opt.element);
    self.group = self.surface.group();

    // load the svg and fill up all board area's and field's
    Snap.load(opt.file, function(map) {
        // TODO: get it from the map?
        self.surface.attr({
            viewBox: opt.viewBox
        });
        var aid = "",
            fid = "";
        map.selectAll("g").forEach(function(el) {
            if (el.node.attributes["board:area"]) {
                aid = el.node.attributes["board:area"].value.replace(/ /g, "");
                self.area[aid] = new Area();
                self.area[aid].uID = aid;
                self.area[aid].name = el.node.attributes["board:area"].value;
                self.area[aid].quality = el.node.attributes["board:quality"].value;
            }
            if (el.node.attributes["board:field"]) {
                fid = self.area[aid].uID + el.node.attributes["board:field"].value.replace(/ /g, "");
                self.field[fid] = new Field(opt.field);
                self.area[aid].field = fid;
                self.field[fid].uID = fid;
                self.field[fid].name = el.node.attributes["board:field"].value;
                self.field[fid].boundary = el.node.attributes["board:boundary"].value.split(",");
                self.field[fid].areaID = self.area[aid].uID;
                el.selectAll("path").forEach(function(el) {
                    self.field[fid].image = el;
                    self.field[fid].image.hover(self.field[fid].onHoverOver, self.field[fid].onHoverOut);
                    self.field[fid].image.click(self.field[fid].onClick);
                    self.field[fid].image.mousemove(self.field[fid].onMouseMove);
                });
            }
        });
        self.group.add(map);
    });
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

function Field(opt) {
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
    var clicked = opt.callbacks.clicked,
        hoverover = opt.callbacks.hoverover,
        hoverout = opt.callbacks.hoverout,
        mousemove = opt.callbacks.mousemove;

    opt.figures.forEach(function(t) {
        self.figure[t] = {
            owner: "",
            amount: 0
        };
    });

    self.onClick = function() {
        clicked(self.uID);
    };

    self.onHoverOver = function() {
        hoverover(self.uID);
    };

    self.onHoverOut = function() {
        hoverout(self.uID);
    };

    self.onMouseMove = function(ev) {
        mousemove(ev, self.uID);
    };
}
