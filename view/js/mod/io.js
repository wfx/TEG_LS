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
 * @return {[object]} [IO]
 */
TC.IO = (function(TC, undefined) {
  'use strict';

  var IO = {
    init: function() {
      IO.socket = io.connect();
      IO.bindEvents();
    },
    /**
     * [Bind socket event's]
     */
    bindEvents: function() {
      IO.socket.on('connected', this.onConnected);
      IO.socket.on('ts', this.onTriggerState);
      IO.socket.on('message', this.onMessage);
      IO.socket.on('error', this.onGameError);
    },

    /**
     * [function description]
     * @param  {[string]} name [Socket name]
     * @param  {[json]}   data []
     */
    emit: function(name, data){
      console.log("Client emit " + name + ". Data:");
      console.log(data);
      console.log("... ...");
      IO.socket.emit(name,data);
    },

    /**
     * [Called on server connection]
     */
    onConnected: function() {
      // TODO: Never again write only hmmm, a year later i have no idea what it means :/
      TC.App.sessionId = IO.socket.io.engine.id; // hmmm.
      console.log('Client: I\'m connected with id: ' + TC.App.sessionId);
    },

    /**
     * [Server can trigger states, if none given then return actualy state and triggers]
     * @param  {[string]} trigger [Any trigger see view/... fsm.json]
     * @param  {[json]}   data    [optional json formated data]
     */
    onTriggerState: function(trigger, data) {
      console.log('Server: trigger ' + trigger);
      if (trigger) {
        TC.App.onTriggerState(trigger, data);
      } else {
        //TC.App.getTriggerState();

        var jData = [];
        jData.push(FSM.stateName);
        jData.push(FSM.currentState);
        IO.socket.emit("message", JSON.stringify(jData));

      }
    },

    /**
     * [Socket for chating messages, not yet implemented]
     * @param  {[json]} data [Json formated data]
     */
    onMessage: function(data) {
      console.log('Message: ' + data);
    },

    /**
     * [Socket for any error (tarzan is an inside joke)]
     * @param  {[json]} data [Json formated data]
     */
    onGameError: function(data) {
      console.log('Tarzan! Error: ' + data);
    }

  };

  /**
   * Return public functions
   */
  return {
    init: IO.init,
    emit: IO.emit
  };

}(TC));
