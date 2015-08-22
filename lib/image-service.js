"use strict";

var request = require('request').defaults({ encoding: null });
var Promise = require('es6-promises');
var db = require('./db');

var COLLECTION_KEY = 'images';
var images = db.collection(COLLECTION_KEY);

module.exports = {
  encodeImage: function(url) {
    return new Promise(function(resolve, reject) {
      var cachedImage = images.where('@url == "' + url + '"');

      if (cachedImage.length > 0) {
        resolve(cachedImage[0].data);
      }

      request(url, function(err, response, body) {
        if (err) {
          return reject(err);
        }

        if (response.statusCode !== 200) {
          return reject(new Error('Error encoding image: ', response.statusCode));
        }

        var data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');

        images.insert({
          url: url,
          data: data
        });

        resolve(data);
      });
    });
  }
};
