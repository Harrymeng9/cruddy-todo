const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // // console.log('CALLBACK', callback);
  // callback(null, { id, text });
  counter.getNextUniqueId((err, data) => {
    fs.writeFile(path.join(exports.dataDir, `${data}.txt`), text, (err) => {
      if (err) {
        throw new Error('ERROR')
      } else {
        //console.log('TEXT', text);
        callback(null, { id:data, text:text });
      }
    })
  })
};

exports.readAll = (callback) => {

  //console.log('items', items);
  //readdir
  fs.readdir(exports.dataDir, (err, files) => {
  //console.log(path.join(exports.dataDir, `.txt`))
    if (err) {
      throw new Error('ERROR');
    } else {
      //var array = [];
      var data = _.map(files, (file) => {
        console.log('FILES', files); // Output: [ '00001.txt', '00002.txt' ]
        // console.log('FILES', fs.readFile(file, callback)); // Output: [ '00001.txt', '00002.txt' ]
        // expected { 'id' : '00001', 'text': 'todo 1'}
        var input = file.split('.')[0]
        var fileSave = { id: input, text: input }
        //array.push({id, text});
        return fileSave;
        // return { id, text };
      });
      callback(null, data);
    }
  })
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
