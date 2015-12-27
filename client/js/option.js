function TypeOfGame() {
  var self = this;
  var self.secretMission = false;
  var self.commonSecretMission = false;
  // self.fogOfWar = false;
  var self._rules = [
    "teg" : "teg",
    "tegRevencha" : "teg revencha",
    "risk" : "risk" ];
  // TODO: teg is set as default but we should use user preferences (file).
  var self.rule = "teg";

  self.setRule = function ( name ) {
    if (self._rules.indexOf(name)){
        self.rule = name
        return true;
    } else {
      return false;
    }
  }

  self.getRuleName = function(){
    return self._rules[ self.rule];
  }

}
