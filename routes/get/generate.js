'use strict';

var fs = require('fs');

var route = function route(req, res, next, abe) {

  abe.abeExtend.process('sitemap');
  res.send('sitemap is being generated. It may take a while if you have a lot of files');
}

exports.default = route