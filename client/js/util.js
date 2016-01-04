// cout("%s, %s and %s", ["Me", "myself", "I"]);
// "Me, myself and I"
function cout(str, args) {
  var regex = /%s/,
    _r = function(p, c) {
      return p.replace(regex, c);
    };
  console.log(args.reduce(_r, str));
}
