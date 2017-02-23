'use strict';

var hooks = {
  afterSave: function(obj, abe) {
  	if (!obj.publishAll && obj.type === "publish") {
			var abeProcess = abe.abeExtend.process('sitemap', [], function (res) {})
	    if (!abeProcess) {
	    	console.log('cannot run process sitemap, because an other one is already running')
	    }
  	}
    return obj
  }
};

exports.default = hooks;