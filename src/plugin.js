'use strict';
/**
 * Sockbot plugin
 *
 * Put your overview here
 *
 * @module pluginName
 * @author YournameHEre
 * @license MIT
 */

// Requisites


// Constants


const internals = {
	browser: null,
	configuration: exports.defaultConfig,
	timeouts: {},
	interval: null,
	events: null
};
exports.internals = internals;


/**
 * Default plugin configuration
 */
exports.defaultConfig = {
	/**
	 * Required delay before posting another reply in the same topic.
	 *
	 * @default
	 * @type {Number}
	 */
	cooldown: 0 * 1000,
};

// Sockbot integration


function registerCommands(events) {
	events.onCommand('echo', 'echo the input', exports.echoHandler, () => 0);
}


/**
 * Prepare Plugin prior to login
 *
 * @param {*} plugConfig Plugin specific configuration
 * @param {Config} config Overall Bot Configuration
 * @param {externals.events.SockEvents} events EventEmitter used for the bot
 * @param {Browser} browser Web browser for communicating with discourse
 */
/*eslint-disable no-console*/
exports.prepare = function prepare(plugConfig, config, events, browser) {
	if (plugConfig === null) {
		plugConfig = {};
	}
	internals.events = events;
	internals.browser = browser;
	internals.configuration = config.mergeObjects(true, exports.defaultConfig, plugConfig);
	registerCommands(events);
};
/*eslint-enable no-console*/

/**
 * Start the plugin after login
 */
exports.start = function start() {};

/**
 * Stop the plugin prior to exit or reload
 */
exports.stop = function stop() {};


// Exported functions and objects

exports.echoHandler = function (command) {
	const text = (internals.configuration.prefix ? 'ECHO: ' : '') + command.post.input;
	internals.browser.createPost(command.post.topic_id, command.post.post_number, text, () => 0);
	return Promise.resolve();
};
