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
      IO.socket.emit(name,data);
    },

    /**
     * [Called on server connection]
     */
    onConnected: function() {
      TC.App.sessionId = IO.socket.io.engine.id; // hmmm.
      console.log('Client: I\'m connected with id: ' + TC.App.sessionId);
    },

    /**
     * [Server can trigger states, if none given then return actualy state and triggers]
     * @param  {[string]} trigger [Any trigger see tegclient.json]
     * @param  {[json]}   data    [optional json formated data]
     */
    onTriggerState: function(trigger, data) {
      console.log('Server: trigger ' + trigger);
      if (trigger) {
        TC.App.onTriggerState(trigger, data);
      } else {
        TC.App.getTriggerState();
        /*
        var jData = [];
        jData.push(FSM.stateName);
        jData.push(FSM.currentState);
        IO.socket.emit("message", JSON.stringify(jData));
        */
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
     * [Socket for any error (tarzan is an inside jocke)]
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
