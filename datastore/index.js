const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    fs.writeFile(path.join(exports.dataDir, `${data}.txt`), text, (err) => {
      if (err) {
        throw new Error('ERROR')
      } else {
        callback(null, { id: data, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw new Error('ERROR');
    } else {
      var data = _.map(files, (file) => {
        var input = file.split('.')[0];
        var fileSave = { id: input, text: input };
        return fileSave;
      });
      callback(null, data);
    }
  })
};

exports.readOne = (id, callback) => {

  var path = `${exports.dataDir}/${id}.txt`;
  fs.readFile(path, (err, data) => {
    if (err || parseInt(id) === NaN) {
      callback(new Error('ERROR'));
    } else {
      callback(null, { id, text: data.toString() });
    }
  });
};

exports.update = (id, text, callback) => {

  var path = `${exports.dataDir}/${id}.txt`;
  fs.exists(path, function (exists) {
    if (!exists) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
  var path = `${exports.dataDir}/${id}.txt`;

  fs.unlink(path, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
