var Observer = (function(window, undefined) {
  "use strict";

  var Observer = {
    /**
     * [init: Is log true then cout print out some log's]
     */
    init: function() {
      Observer.log = true;
      Observer.list = [];
    },

    /**
     * [Print out any data]
     * @param  {[string]} data [holds the printed data]
     */
    cout: function(data) {
      if (Observer.log) {
        console.log(data);
      }
    },

    /**
     * [Attach an Object to the subject list]
     * @param  {[object]} obj [a valid obj with one update function]
     * @return {[bool]}       [attach processes true or false]
     */
    attach: function(obj) {
      if (Observer.list.indexOf(obj) < 0) {
        Observer.cout('attach observer');
        Observer.list.push(obj);
        return true;
      }
      Observer.cout('object allready on list');
      return false;
    },

    detach: function(obj) {
      for (var i = 0, len = Observer.list.length; i < len; i++) {
        if (Observer.list[i] === obj) {
          Observer.cout('detach observer');
          Observer.list.splice(i, 1);
          return true;
        }
      }
      return false;
    },

    update: function(data) {
      for (var i = 0, len = Observer.list.length; i < len; i++) {
        Observer.cout('update subject' + i);
        Observer.list[i].update(data);
      }
    }

  };

  return Observer;

})(window);
