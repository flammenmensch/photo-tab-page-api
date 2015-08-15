"use strict";

var request = require('request').defaults({ encoding: null });
var Promise = require('es6-promises');

module.exports = {
  encodeImage: function(url) {
    return new Promise(function(resolve, reject) {
      request(url, function(err, response, body) {
        if (err) {
          return reject(err);
        }

        if (response.statusCode !== 200) {
          return reject(new Error('Error encoding image: ', response.statusCode));
        }

        var data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');

        resolve(data);
      });
    });
  }
};
