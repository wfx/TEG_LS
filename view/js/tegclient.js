/**
 * Main:
 * Load state definitions for the client (fms) and init all module.
 */
$.getJSON("js/config.json", function(config) {
  TC.FSM.init(config.start, config.transitions);
  TC.IO.init();
  TC.App.init();
  TC.UI.init();

  TC.IO.emit("advise", {
    name: "state",
    value: "ready"
  });

});
