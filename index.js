'use strict';

var d       = require('d')
  , memoize = require('memoizee/plain')
  , debug   = require('debug')

  , now = Date.now, defineProperties = Object.defineProperties
  , log = process.stdout.write.bind(process.stdout);

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

var enabledExt = {
	open: d(function () {
		var originalLog = this.log;
		this.log = log;
		this.startTime = now();
		this.apply(null, arguments);
		log(' ');
		this.log = originalLog;
	}),
	progress: d(function () { log('.'); }),
	close: d(function () {
		var useColors = this.useColors;

		if (useColors) {
			log('  \u001b[3' + this.color + ';1m' + debug.humanize(now() - this.startTime) +
				'\u001b[0m\n');
		} else {
			log(' ' + debug.humanize(now() - this.startTime) + '\n');
		}
	})
};

var disabledExt = {
	open: d(Function.prototype),
	progress: d(Function.prototype),
	close: d(Function.prototype)
};

module.exports = memoize(function (namespace) {
	var original = debug(namespace);
	return defineProperties(original, original.enabled ? enabledExt : disabledExt);
});