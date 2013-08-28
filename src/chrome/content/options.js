'use strict';
var grayScaleToolbarIconsOptions = {
	_prefs: null,
  _tree: null,
  _toolbarIds: null,

	_handleWindowLoad: function(evt) {
		window.removeEventListener('load', grayScaleToolbarIconsOptions._handleWindowLoad, false);
		window.setTimeout(function() { grayScaleToolbarIconsOptions.init(); }, 1000); 
	},

	_handleWindowUnload: function(evt) {
    var that = grayScaleToolbarIconsOptions;
		that._prefs = null;
		that._tree = null;
    window.removeEventListener('unload', that._handleWindowUnload, false);    
    window.removeEventListener('dialogaccept', that._handleDialogAccept, false);
	},

	init: function() {
    window.addEventListener('dialogaccept', this._handleDialogAccept, false);
		try {    
      Components.utils.import('chrome://grayscale-toolbar-icons/content/lib/kashiif-utils.jsm', this);
      Components.utils.import('chrome://grayscale-toolbar-icons/content/lib/common.jsm', this);
		}
		catch(ex) {
      Components.utils.reportError(ex);
      return;
		}
      
    this.utils.logger.init();
    this.log = function(msg) {
      grayScaleToolbarIconsOptions.utils.logger.log(msg);
    };
  
    window.addEventListener('unload', grayScaleToolbarIconsOptions._handleWindowUnload, false);
    // initialize prefService reference
    this._prefs = Components.classes['@mozilla.org/preferences-service;1']
              .getService(Components.interfaces.nsIPrefService)
              .getBranch('extensions.grayscaletoolbaricons.');

    this._tree = document.getElementById('grayscale-toolbar-icons-tree');
    this._populateToolbars(this._tree, this.getToolbarIdsArrayFromPrefString(this._prefs.getCharPref('disabletoolbars')));
	},
  
  _populateToolbars: function(tree, idsOfToolbarsToIgnore) {

    var allToolbars = this.utils.getWindow().document.getElementsByTagName("toolbar"),
        treeChildren = tree.treeBoxObject.treeBody,
        cols = ["grayscale-toolbar-icons-coltoolbarid", "grayscale-toolbar-icons-coltoolbarname"],
        vals = [,],
        colSelect = tree.columns.getNamedColumn("grayscale-toolbar-icons-colselect");
        
    this._toolbarIds = [];
    this._currentIgnoredToolbarIds = [];

    Components.utils.import('chrome://grayscale-toolbar-icons/content/lib/treeutils.jsm', tree);

    
		tree.treeBoxObject.beginUpdateBatch();
    
    for (var i=0, j=0;  i<allToolbars.length ;i++) {
      var toolbar = allToolbars[i],
          toolbarName = toolbar.getAttribute("toolbarname");
      
      this.log(toolbarName + " - " + toolbar.id);
      if (!toolbar.id) return;
      
      var label = toolbarName? toolbarName: toolbar.id;
      
      if (label) {
        var treeItem = tree.newTreeItem(),
            isIgnoredToolbar = (idsOfToolbarsToIgnore.indexOf(toolbar.id) >= 0);
        
        
        vals[0] = toolbar.id;
        vals[1] = label;
        
        this.log(isIgnoredToolbar + " " + vals);
        
        tree.updateRowCore(j, cols, vals);
        var cell = treeItem.firstChild.getElementsByTagName('treecell')[0];
        cell.setAttribute('properties', 'green-check-box');
        
        tree.view.setCellValue(j, colSelect, isIgnoredToolbar );
        this._toolbarIds.push(toolbar.id);
        if (isIgnoredToolbar) {
          this._currentIgnoredToolbarIds.push(toolbar.id);
        }
        
        j++;
      }
    }
		tree.treeBoxObject.endUpdateBatch();
  },

  _handleDialogAccept: function() {
      
      var that = grayScaleToolbarIconsOptions;
      
  
      try {
        var newIgnoredToolbars = that._getToolbarIdsForCheckedItems();
        
        var removed = that._currentIgnoredToolbarIds.filter(function(val, index, arr) {
            //this.log('Filter removed: ' + val + ' ' + (newIgnoredToolbars.indexOf(val) < 0));
            return (newIgnoredToolbars.indexOf(val) < 0);
          }, that);


        var added = newIgnoredToolbars.filter(function(val, index, arr) {
            //this.log('Filter added: '+ val + ' ' + (this._currentIgnoredToolbarIds.indexOf(val) < 0));
            return (this._currentIgnoredToolbarIds.indexOf(val) < 0);
          }, that);
          
        that.log('Added: ' + added);  
        that.log('Removed: ' + removed);
          
        // for every win
        var win = that.utils.getWindow();
        that._updateToolbars(win);
        // end for
      }
      catch(ex) {
        Components.utils.reportError(ex);
      }
      
      return true;
  },
  
  _updateToolbars: function(win) {
    
  
  },
  
  _getToolbarIdsForCheckedItems: function() {
    var v = this._tree.view,
        colSelect = this._tree.columns.getNamedColumn('grayscale-toolbar-icons-colselect'),
        colId = this._tree.columns.getNamedColumn('grayscale-toolbar-icons-coltoolbarid');

    var objs = [];
    for (var i=0 ; i<v.rowCount ; i++) {
      var val = v.getCellValue(i, colSelect);
            
      if (val == 'true') {
        //var row = this._tree.getTreeRowAtIndex(i);
        objs.push( v.getCellText(i, colId) );
      }
    }

    return objs;
  },
  /*
  _checkDisabledToolbars: function(toolbarIds) {	
		for (var i=0 ; i<toolbarIds.length ; i++) {
			var toolbar = document.getElementById(toolbarIds[i]);
			if (toolbar) {
				toolbar.classList.add('grayscale-disabled');
			}
		}
	},
  
  _checkTreeCell: function(index, toolbarId) {
      
  },
  */
  
  log : function(msg) {
  },

};
window.addEventListener(
  'load', 
  grayScaleToolbarIconsOptions._handleWindowLoad, 
  false
);
