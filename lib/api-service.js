"use strict";

var request = require('request');
var Promise = require('es6-promises');
var querystring = require('querystring');
var db = require('./db');

var CONSUMER_KEY = process.env.CONSUMER_KEY;
var API_URL = 'https://api.500px.com/v1/photos';
var COLLECTION_KEY = 'photos';

var photos = db.collection(COLLECTION_KEY);

module.exports = {
  load: function() {
    return new Promise(function(resolve, reject) {
      var cachedData = photos.items;

      if (cachedData.length > 0) {
        return resolve(cachedData);
      }

      request(API_URL + '?' + querystring.stringify({
          consumer_key: CONSUMER_KEY,
          feature: 'editors',
          only: 'Macro',
          rpp: 100,
          sort: 'created_at',
          image_size: 2048
        }),
        function(err, response, body) {
          if (err) {
            return reject(err);
          }

          if (response.statusCode !== 200) {
            return reject(new Error('Error: ' + response.statusCode));
          }

          var data = JSON.parse(body).photos.filter(function(item) {
            return item.width > item.height;
          });

          photos.insert(data);

          resolve(data);
        }
      );
    });
  }
};
