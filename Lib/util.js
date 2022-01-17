/**
 * Common functions
 */

const dir = require('node-dir');
const path = require('path');
const fs = require('fs');

/**
 * Shortcut to fetch JSON data from a file
 *
 * @param  {string} file File name
 * @returns {JSON}      The resulting object
 */
function getJSON(file) {
  const data = fs.readFileSync(file, 'utf8');
  return JSON.parse(data);
}

/**
 * Responds with a list of *.json taken from a subdirectory
 *
 * Each object will have a special `_id` key appended to it.
 *
 * @param  {array} subdirs The base directory
 * @param  {function} callback The function to run on the resulting array, takes 1 argument
 * @returns the result of the callback.
 */
function getDirectoryJSONs(subdirs, callback){
  // init response array
  let objects = [];
  // int subdir array
  subdirs = subdirs.split("/");
  // iterate through every file
  dir.files(
    path.resolve.apply(null, subdirs), function(err, files) {
      if (err) {console.error(err)}; // rethrow error
      let file;
      for (file of files) {
        // skip if the file doesn't end with *.json
        if (!/.+\.(json|JSON)$/.exec(file)) break;

        // try to get the basename
        let basename_match = /[\\/]([\w\s]+)\.(json|JSON)$/mu.exec(file);

        // add JSON to posts list
        try {
          let object = getJSON(file);
          // append basename
          object._id = basename_match[1];

          objects.push(object);
        } catch (e) {
          console.error(`Error on parsing: ${file}, skipping.`)
          console.error(e);
        }
      }
      return callback(objects);
    });
}

module.exports = {
  getJSON: getJSON,
  getDirectoryJSONs: getDirectoryJSONs
};
