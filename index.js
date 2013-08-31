var DEFAULT_PATH = './db';

var up = require('levelup');
var down = require("leveldown");
var info = require("local-debug")("info");
var trace = require("local-debug")("trace");

module.exports = newIO;

function destroy (path, callback) {
  info('Destroying %s', path);

  down.destroy(path, callback);
}

function get (io, key, callback) {
  trace('Getting %s', key);

  io.get(key, function (error, raw) {
    if(error) return callback(error);

    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (exc) {
      return callback(exc);
    }

    callback(undefined, parsed);
  });
}

function set (io, key, obj, callback) {
  var stringified;

  try {
    stringified = JSON.stringify(obj);
  } catch (exc) {
    return callback(exc);
  }

  trace('Setting %s as %s', key, stringified.substring(0, 25) + '...');

  io.put(key, stringified, callback);
}

function newIO (dir) {

  dir || ( dir = DEFAULT_PATH);

  var io = up(dir);

  info('Connected to %s', dir);

  wrapper.close = function (cb) {
    info('Closing %s', dir);
    io.close(cb);
  };

  wrapper.destroy = function (cb) {
    destroy(dir, cb);
  }

  wrapper.get = function (key, cb) {
    get(io, key, cb);
  }

  wrapper.set = function (key, value, cb) {
    set(io, key, value, cb);
  }

  wrapper.dir = dir;

  return wrapper;

  function wrapper () {
    var fn;
    var args = Array.prototype.slice.call(arguments);

    if (args.length == 2) fn = get;
    if (args.length == 3) fn = set;

    Array.prototype.splice.call(args, 0, 0, io);

    return fn.apply(undefined, args);
  }

}
