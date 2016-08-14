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
 *  ECMA6
 *  Field: Field data model
 */

class Field {
  constructor(f) {
    this.id = f.id; // The svg element id
    this.owner = 0; // Player id, 0 is none
    this.selected = false;
    this.name = f.name;
    this.img = f.img;
    this.cbMouseClick = f.cbMouseClick;
    this.cbMouseHoverOver = f.cbMouseHoverOver;
    this.cbMouseHoverOut = f.cbMouseHoverOut;
    this.cbMouseMove = f.cbMouseMove;

    // whitout .bind(this) it points anywhery else.
    this.img.click(this.onMouseClick.bind(this));
    this.img.hover(this.onMouseHoverOver.bind(this), this.onMouseHoverOut.bind(this));
    this.img.mousemove(this.onMouseMove.bind(this));

  }
  onMouseClick() {
    this.cbMouseClick(this.id);
  }
  onMouseHoverOver() {
    this.cbMouseHoverOver(this.id);
  }
  onMouseHoverOut() {
    this.cbMouseHoverOut(this.id);
  }
  onMouseMove(ev) {
    this.cbMouseMove(ev, this.id);
  }
}
