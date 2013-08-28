/**************************************************************************
* Copyright Kashif Iqbal Khan (kashiif@gmail.com
**************************************************************************/
'use strict';
var EXPORTED_SYMBOLS = ['getToolbarIdsArrayFromPrefString'];

function getToolbarIdsArrayFromPrefString(prefString) {
    if (prefString) {
      return prefString.split(',');
    }
    
    return [];

}

function processToolbar(callback, prefIds) {
    var arrIds = [];
    if ("String" == typeof prefIds) {
      arrIds = getToolbarIdsArrayFromPrefString(prefIds);
    }
    else if ("Array" == typeof prefIds) {
      arrIds = prefIds;
    }
    
    for (var i=0 ; i<arrIds.length; i++) {
          callback(i, arrIds[i]);
    }
    
}