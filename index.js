'use strict';

var aFrom    = require('es5-ext/array/from')
  , includes = require('es5-ext/array/#/contains')
  , remove   = require('es5-ext/array/#/remove')
  , util     = require('util')
  , d        = require('d')
  , autoBind = require('d/auto-bind')
  , memoize  = require('memoizee/plain')
  , debug    = require('debug')

  , now = Date.now, defineProperties = Object.defineProperties
  , log = function () { process.stdout.write(util.format.apply(this, arguments)); }
  , colors = aFrom(debug.colors), prevColor = 0;

// Strip execution time output
debug.formatArgs = function () {
	var args = arguments;
	var useColors = this.useColors;
	var name = this.namespace;

	if (useColors) {
		var c = this.color;

		args[0] = '  \u001b[3' + c + ';1m' + name + ' '
			+ '\u001b[0m'
			+ args[0];
	} else {
		args[0] = name + ' ' + args[0];
	}
	return args;
};

var enabledExt = autoBind({
	open: d(function () {
		var originalLog = this.log;
		this.log = log;
		this.startTime = now();
		this.apply(null, arguments);
		log(' ');
		this.log = originalLog;
	}),
	progress: d(function (mark) { log(mark || '.'); }),
	close: d(function () {
		var useColors = this.useColors;

		if (useColors) {
			log(' \u001b[3' + this.color + ';1m' + debug.humanize(now() - this.startTime) +
				'\u001b[0m\n');
		} else {
			log(' ' + debug.humanize(now() - this.startTime) + '\n');
		}
	})
}, { overwriteDefinition: true });

var disabledExt = {
	open: d(Function.prototype),
	progress: d(Function.prototype),
	close: d(Function.prototype)
};

module.exports = memoize(function (namespace/*, color*/) {
	var original = debug(namespace), color = arguments[1];
	if (color == null) {
		color = colors[prevColor++ % colors.length];
	} else {
		if (!includes.call(debug.colors, color)) throw new TypeError("Unrecognized color");
		remove.call(colors, color);
	}
	original.color = color;
	return defineProperties(original, original.enabled ? enabledExt : disabledExt);
}, { length: 1 });
