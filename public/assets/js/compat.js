(function installLegacyCompatibility(global) {
  "use strict";

  global.format = function format(template) {
    var values = Array.prototype.slice.call(arguments, 1);
    var index = 0;

    return String(template).replace(/\{\}/g, function replacePlaceholder() {
      var value = values[index];
      index += 1;
      return value === undefined ? "" : String(value);
    });
  };

  global.VM = {
    re_init: function reinitializeDemonstration() {
      global.dispatchEvent(new CustomEvent("demo:reinitialize"));
    }
  };
})(window);
