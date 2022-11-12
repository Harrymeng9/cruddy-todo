const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const fsPromised = Promise.promisifyAll(fs);

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
  //Promisify the entire library (they gave us a hint in GLearn and live lesson);
  //after the library has been promisified, then we can create a seperate call to
  //the library functions asynchonously

  return fsPromised.readdirAsync(exports.dataDir)
    .then((files) => {
      var data = _.map(files, (file) => {
        // console.log('FILE', file);
        var id = file.split('.')[0];
        //this accesses the text in the file
        return fsPromised.readFileAsync(path.join(exports.dataDir, file), 'utf8')
        .then((text) => {
          return {id:id, text:text};
        })

      })
      Promise.all(data).then((data) => {
        callback(null, data);
      })
    })
    .catch((err) => {
      callback(err);
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

var readSync = Promise.promisify(exports.readAll);
//Promise.all([exports.create, exports.readAll, exports.readOne, exports.update, exports.delete]);

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
