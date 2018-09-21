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
 *  Observer: primitve observer like pattern
 */

class Observer {
  constructor() {
    this.list = [];
  }

  attach(obj) {
    if (this.list.indexOf(obj) < 0) {
      this.list.push(obj);
      return true;
    }
    return false;
  }

  detach(obj) {
    for (var i = 0, len = this.list.length; i < len; i++) {
      if (this.list[i] === obj) {
        this.list.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  update(data) {
    for (var i = 0, len = this.list.length; i < len; i++) {
      this.list[i].update(data); // why does it work whitout a .bind(this)
    }
  }
}
