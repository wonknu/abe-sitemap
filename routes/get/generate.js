'use strict';

var fs = require('fs');

var route = function route(req, res, next, abe) {

  if (abe.abeExtend.process('sitemap')) {
  	res.send('sitemap is being generated. It may take a while if you have a lot of files');
  }else {
 		res.send('cannot run process sitemap, because an other one is already running');
  }
}

exports.default = route