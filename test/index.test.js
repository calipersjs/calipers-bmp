'use strict';

var fs     = require('fs');
var path   = require('path');
var expect = require('chai').expect;
var bmp    = require('../lib/index');

describe('bmp', function () {

  describe('detect', function () {
    it('should return true for a BMP', function () {
      var bmpPath = path.resolve(__dirname, 'fixtures/bmp/233x143.bmp');
      var result = bmp.detect(fs.readFileSync(bmpPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-BMP', function () {
      var jpegPath = path.resolve(__dirname, 'fixtures/jpeg/123x456.jpg');
      var result = bmp.detect(fs.readFileSync(jpegPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var fixtures = path.resolve(__dirname, '../test/fixtures/bmp');
    var files = fs.readdirSync(fixtures);

    files.forEach(function (file) {

      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'bmp',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        var bmpPath = path.resolve(fixtures, file);
        var fd = fs.openSync(bmpPath, 'r');
        return bmp.measure(bmpPath, fd)
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        })
        .finally(function () {
          fs.closeSync(fd);
        });
      });

    });

  });

});
