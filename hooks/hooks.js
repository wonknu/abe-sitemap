'use strict';

var hooks = {
  afterSave: function(obj, abe) {
  	if (!obj.publishAll && obj.type === "publish") {
	    abe.abeProcess('sitemap');
  	}
    return obj
  }
};

exports.default = hooks;