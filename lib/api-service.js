"use strict";

var request = require('request');
var Promise = require('es6-promises');
var NodeCache = require('node-cache');
var querystring = require('querystring');

var CONSUMER_KEY = 'RQnHKkREu5NQXWXluNViGlHannGY3xFIBqxbZFbt';
var API_URL = 'https://api.500px.com/v1/photos';
var CACHE_KEY = 'photos';

var cache = new NodeCache();

module.exports = {
  load: function() {
    return new Promise(function(resolve, reject) {
      var cachedData = cache.get(CACHE_KEY);

      if (cachedData) {
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

          var data = JSON.parse(body).photos;

          cache.set(CACHE_KEY, data, 30); // 30s

          resolve(data);
        }
      );
    });
  }
};
