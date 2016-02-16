var EventStateMachine = function(stateName, transitions) {
  "use strict";
  // transition is a array
  this.stateName = stateName;
  this.transitions = transitions;
  this.currentState = this.transitions[this.stateName];
  this.events = {};
  this.log = false;

  this.trigger = function(eventName, data) {
    if (this.currentState[eventName]) {
      this.stateName = this.currentState[eventName];
      if (this.log) {
        console.log("event: \"" + eventName + "\" change state to: \"" + this.stateName + "\"");
      }
      this.currentState = this.transitions[this.stateName];
      this.cb(eventName, data);
    } else {
      return false;
    }
  };

  this.on = function(eventName, callback) {
    if (!this.events[eventName]) {
      // array of callback's
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  };

  this.cb = function(eventName, data) {
    if (this.events[eventName]) {
      // call every event callback's
      for (var i = 0; i < this.events[eventName].length; i++) {
        this.events[eventName][i](data);
      }
    } else {
      return false;
    }
  };

};
