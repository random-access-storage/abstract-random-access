var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var assert = require('assert')

var noop = function () {}

module.exports = Abstract
inherits(Abstract, EventEmitter)

function Abstract () {
  if (!(this instanceof Abstract)) return new Abstract()
  EventEmitter.call(this)
  this.opened = false
}

Abstract.prototype.open = function (callback) {
  var self = this
  if (this.opened) return process.nextTick(callback)
  if (typeof this._open !== 'function') process.nextTick(next)
  else this._open(next)

  function next (err) {
    if (err) return callback(err)
    self.opened = true
    self.emit('open')
    callback()
  }
}

Abstract.prototype.write = function (offset, buffer, callback) {
  var self = this
  callback = callback || noop

  assert(typeof offset === 'number', 'Scalar offset')
  assert(Buffer.isBuffer(buffer), 'Buffer')

  if (!this.opened) this.open(next)
  else next()

  function next (err) {
    if (err) return callback(err)
    if (typeof self._write !== 'function') return process.nextTick(callback)
    self._write(offset, buffer, callback) 
  }
}

Abstract.prototype.read = function (offset, length, callback) {
  var self = this

  assert(typeof offset === 'number', 'Scalar offset')
  assert(typeof length === 'number', 'Scalar length')
  assert(typeof callback === 'function', 'Callback')

  if (!this.opened) this.open(next)
  else next()

  function next (err) {
    if (err) return callback(err)
    if (typeof self._read !== 'function') return process.nextTick(callback)
    self._read(offset, length, callback)
  }
}

Abstract.prototype.close = function (callback) {
  var self = this
  callback = callback || noop

  if (!this.opened) this.open(next)
  else next()

  function next (err) {
    if (err) return cb(err)
    if (typeof self._close !== 'function') process.nextTick(closed)
    self._close(closed)
  }

  function closed (err) {
    if (err) return callback(err)
    self.opened = false
    self.emit('close')
    callback()
  }
}

Abstract.prototype.end = function (options, callback) {
  var self = this
  if (!options || typeof options === 'function') {
    callback = options
    options = {}
  }
  callback = callback || noop

  if (!this.opened) this.open(next)
  else next()

  function next (err) {
    if (err) return cb(err)
    if (typeof self._end !== 'function') process.nextTick(callback)
    else self._end(options, callback)
  }
}

Abstract.prototype.unlink = function (callback) {
  var self = this
  callback = callback || noop

  if (!this.opened) this.open(next)
  else next()

  function next (err) {
    if (err) return cb(err)
    if (typeof self._unlink !== 'function') process.nextTick(callback)
    else self._unlink(callback)
  }
}
