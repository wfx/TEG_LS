var FinitStateMachine = (function(window, undefined) {
  'use strict';
  
  var FSM = {
    /**
     * [Init FSM]
     * @param  {[string]} startName [Set the initial starting state]
     * @param  {[json]} transitions [The transitions, see tegclient.json]
     */
    init: function(startName, transitions) {
      FSM.stateName = startName;
      FSM.transitions = transitions;
      FSM.currentState = FSM.transitions[startName];
      FSM.callbacks = {};
      FSM.log = true;
    },

    /**
     * [Print out any data]
     * @param  {[string]} data [holds the printed data]
     */
    cout: function(data) {
      if (FSM.log) {
        console.log(data);
      }
    },
    /**
     * [Change to a state and call the every trigger binded callback's]
     * @param  {[string]} triggerName [The trigger name]
     * @param  {[json]} data          [Optional data passed to the callback function]
     * @return {[bool]}               [False if trigger not possible]
     */
    trigger: function(triggerName, data) {
      if (FSM.currentState[triggerName]) {
        FSM.stateName = FSM.currentState[triggerName];
        // log
        FSM.cout("FSM Trigger: " + triggerName + ". state is now: " + FSM.stateName);
        FSM.currentState = FSM.transitions[FSM.stateName];
        FSM.cb(triggerName, data);
      } else {
        // log
        FSM.cout("FSM Trigger " + triggerName + " is not available on state " + FSM.stateName);
        return false;
      }
    },

    /**
     * [function description]
     * @param  {[string]} triggerName [The trigger name]
     * @param  {[json]} data          [Optional data passed data]
     * @return {[bool]}               [False on wrong callback function name]
     */
    cb: function(triggerName, data) {
      if (FSM.callbacks[triggerName]) {
        for (var i = 0; i < FSM.callbacks[triggerName].length; i++) {
          FSM.callbacks[triggerName][i](data);
        }
      } else {
        return false;
      }
      return true;
    },

    /**
     * [atach callback function to trigger]
     * @param  {[string]} triggerName [Name of the trigger]
     * @param  {Function} callback    [Callback function]
     */
    on: function(triggerName, callback) {
      if (!FSM.callbacks[triggerName]) {
        FSM.callbacks[triggerName] = [];
      }
      FSM.callbacks[triggerName].push(callback);
    }
  };

  return FSM;

})(window);
