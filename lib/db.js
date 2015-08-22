"use strict";

var locallydb = require('locallydb');
var db = new locallydb('./.data');

module.exports = db;
