var DEFAULT_PATH = './db';

var up = require('levelup');
var down = require("leveldown");
var info = require("local-debug")("info");
var trace = require("local-debug")("trace");

module.exports = newIO;
module.exports.destroy = destroy;
module.exports.repair = repair;

function destroy (path, callback) {
  info('Destroying %s', path);

  down.destroy(path, callback);
}

function get (io, key, callback) { // OR (io, key, options, callback)
  trace('Getting %s', key);

  var options;

  if (arguments.length > 3) {
    options = arguments[2];
    callback = arguments[3];
  }

  io.get(key, options, callback);
}

function method (io, name, callback) {
  return function () {
    trace('Calling method: %s', name);
    return io[name].apply(io, arguments);
  };
}

function repair (location, callback) {
  info('Repairing %s', location);
  down.repair(location, callback);
}

function set (io, key, value, callback) {
  var options;

  if (arguments.length > 4) {
    options = arguments[3];
    callback = arguments[4];
  }

  trace('Setting %s. Encoding: %s', key, options ? options.valueEncoding : 'String');

  io.put(key, value, options, callback);
}

function newIO (callback) {
  var dir = DEFAULT_PATH;
  var options;

  if (typeof callback == 'string') {
    dir = callback;
    callback = undefined;
  }

  if (arguments.length > 1) {
    dir = arguments[0];
    callback = arguments[1];
  }

  if (arguments.length > 2) {
    options = arguments[1];
    callback = arguments[2];
  }

  if (!options || options.encoding) {
    options || (options = {});
    options.encoding = {
      encode: JSON.stringify,
      decode: JSON.parse
    };
  }

  var io = up(dir, options, callback);

  info('Connected to %s', dir);

  wrapper.get = function (key, cb) {
    get(io, key, cb);
  };

  wrapper.set = function (key, value, cb) {
    set(io, key, value, cb);
  };

  wrapper.batch = method(io, 'batch');
  wrapper.close = method(io, 'close');
  wrapper.del = method(io, 'del');
  wrapper.isClosed = method(io, 'isClosed');
  wrapper.isOpen = method(io, 'isOpen');

  wrapper.destroy = function (callback) {
    if (wrapper.isClosed()) return destroy(dir, callback);

    wrapper.close(function (error) {
      if (error) return callback(error);

      destroy(dir, callback);
    });
  };

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
