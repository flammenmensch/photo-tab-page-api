"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var apiService = require('./lib/api-service');
var imageService = require('./lib/image-service');
var utils = require('./lib/utils');

var app = express();
app.use(compression());
app.use(bodyParser.json());

app.route('/api')
  .get(
    function(req, res) {
      apiService.load()
        .then(function(photos) {
          var index = utils.getRandomInt(0, photos.length - 1);
          return photos[index];
        })
        .then(function(photo) {
          return imageService.encodeImage(photo.image_url);
        })
        .then(function(encodedImage) {
          res.status(200).json({ status: 'ok', photo: encodedImage });
        })
        .catch(function(err) {
          res.status(500).json({ error: true, message: err.message});
        });
    }
  );

app.listen(process.env.PORT || 3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.info('Server is up and running');
});
