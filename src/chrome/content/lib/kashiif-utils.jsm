'use strict';
var EXPORTED_SYMBOLS = ['utils'];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

var gConsoleService = null;
var utils = {


  logger: {

    init: function() {
      gConsoleService = Cc['@mozilla.org/consoleservice;1'].
                            getService(Ci.nsIConsoleService);
    },

    log: function(msg) {
      if (!gConsoleService) return;
      gConsoleService.logStringMessage(msg);
    },
    
    debug: function(msg) {
      if (!gConsoleService) return;
      gConsoleService.logStringMessage(msg);
    },
    
    error: function(msg) {
      Cu.reportError(msg);
    }
  },

	getWindow: function() {
		return Cc['@mozilla.org/appshell/window-mediator;1']
                .getService(Ci.nsIWindowMediator)
                .getMostRecentWindow('navigator:browser');
	}

};
