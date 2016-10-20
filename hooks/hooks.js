'use strict';

var hooks = {
  afterSave: function(obj, abe) {
  	if (!obj.publishAll && obj.type === "publish") {
	    if (!abe.abeExtend.process('sitemap')) {
	    	console.log('cannot run process sitemap, because an other one is already running')
	    }
  	}
    return obj
  }
};

exports.default = hooks;