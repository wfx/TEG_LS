var Subject = (function(window, undefined) {
  "use strict";

  var Subject = {
    /**
     * [init: Is log true then cout print out some log's]
     */
    init: function() {
      Subject.log = true;
      Subject.list = [];
    },

    /**
     * [Print out any data]
     * @param  {[string]} data [holds the printed data]
     */
    cout: function (data) {
      if(Subject.log){
        console.log(data);
      }
    },

    /**
     * [Attach an Object to the subject list]
     * @param  {[object]} obj [a valid obj with one update function]
     * @return {[bool]}       [attach processes true or false]
     */
    attach: function(obj) {
      if (Subject.list.indexOf(obj) < 0) {
        Subject.cout('attach observer');
        Subject.list.push(obj);
        return true;
      }
      Subject.cout('object allready on list');
      return false;
    },

    detach: function(obj) {
      for (var i = 0, len = Subject.list.length; i < len; i++) {
        if (Subject.list[i] === obj) {
          Subject.cout('detach observer');
          Subject.list.splice(i, 1);
          return true;
        }
      }
      return false;
    },

    update: function(data) {
      for (var i = 0, len = Subject.list.length; i < len; i++) {
        Subject.cout('update subject' + i);
        Subject.list[i].update(data);
      }
    }

  };

  return Subject;

})(window);
