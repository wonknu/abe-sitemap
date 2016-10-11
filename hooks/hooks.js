'use strict';

var hooks = {
  afterSave: function(obj, abe) {
  	if (!obj.publishAll && obj.type === "publish") {
	    abe.abeExtend.process('sitemap');
  	}
    return obj
  }
};

exports.default = hooks;