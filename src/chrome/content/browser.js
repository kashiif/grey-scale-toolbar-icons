'use strict';
Components.utils.reportError('Started');
//*
var grayScaleToolbarIcons = {
	_prefs: null,

	_handleWindowLoad: function(evt) {
		window.removeEventListener('load', grayScaleToolbarIcons._handleWindowLoad, false);
		window.setTimeout(function() { grayScaleToolbarIcons.init(); }, 1000); 
	},

	_handleWindowUnload: function(evt) {
		grayScaleToolbarIcons._prefs = null;
	},

	init: function() {
		try {
		window.addEventListener('unload', grayScaleToolbarIcons._handleWindowUnload, false);
		// initialize prefService reference
		this._prefs = Components.classes['@mozilla.org/preferences-service;1']
							.getService(Components.interfaces.nsIPrefService)
							.getBranch('extensions.grayscaletoolbaricons.');

		this._processToolbars(this._prefs.getCharPref('disabletoolbars').split(','));
		}
		catch(ex) {
		Components.utils.reportError(ex);
		}
	},
	
    _processToolbars: function(toolbarIds) {
		Components.utils.reportError('toolbarIds.length: ' + toolbarIds.length);
	
		for (var i=0 ; i<toolbarIds.length ; i++) {
			var toolbar = document.getElementById(toolbarIds[i]);
			Components.utils.reportError('processing ' + toolbarIds[i] + ': ' + toolbar);
			if (toolbar) {
				toolbar.classList.add('grayscale-disabled');
			}
		}
	}

};
window.addEventListener(
  'load', 
  grayScaleToolbarIcons._handleWindowLoad, 
  false
);
