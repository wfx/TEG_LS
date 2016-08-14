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
 *  FSM: finit state machine
 */

class FSM {
  /**
   * @param  {[string]} startName [Set the initial starting state]
   * @param  {[json]} transitions [The transitions, see tegclient.json]
   */
  constructor(startName, transitions) {
    this.stateName = startName;
    this.transitions = transitions;
    this.currentState = this.transitions[startName];
    this.callbacks = {};
  }

  /**
   * [Change to a state and call the every trigger binded callback's]
   * @param  {[string]} triggerName [The trigger name]
   * @param  {[json]} data          [Optional data passed to the callback function]
   * @return {[bool]}               [False if trigger not possible]
   */
  trigger(triggerName, data) {
    if (this.currentState[triggerName]) {
      this.stateName = this.currentState[triggerName];
      console.log("FSM Trigger: " + triggerName + ". state is now: " + this.stateName);
      this.currentState = this.transitions[this.stateName];
      this.cb(triggerName, data);
    } else {
      console.log("FSM Trigger " + triggerName + " is not available on state " + this.stateName);
      return false;
    }
  }

  /**
   * [function description]
   * @param  {[string]} triggerName [The trigger name]
   * @param  {[json]} data          [Optional data passed data]
   * @return {[bool]}               [False on wrong callback function name]
   */
  cb(triggerName, data) {
    if (this.callbacks[triggerName]) {
      for (var i = 0; i < this.callbacks[triggerName].length; i++) {
        this.callbacks[triggerName][i](data); // why does it work whitout a .bind(this)
      }
    } else {
      return false;
    }
    return true;
  }

  /**
   * [atach callback function to trigger]
   * @param  {[string]} triggerName [Name of the trigger]
   * @param  {Function} callback    [Callback function]
   */
  on(triggerName, callback) {
    if (!this.callbacks[triggerName]) {
      this.callbacks[triggerName] = [];
    }
    this.callbacks[triggerName].push(callback);
  }
}
