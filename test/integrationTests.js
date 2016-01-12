'use strict';

const chai = require('chai');
const sinon = require('sinon');
	
//promise library plugins
require('sinon-as-promised');
require('chai-as-promised');

chai.should();
const expect = chai.expect;

/*SETUP*/
const plugin = require('../src/plugin');
const browser = require('../node_modules/sockbot/lib/browser')();
const config = require('../node_modules/sockbot/lib/config');
const command = require('../node_modules/sockbot/lib/commands');

/*Set up fake event emitter*/
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const fakeEmitter = new EventEmitter();

//Functionality we're not testing
fakeEmitter.onNotification = sinon.stub().yields();
fakeEmitter.onMessage = sinon.stub().yields();

//Functionality we are testing
command.prepare(fakeEmitter, () => 0);


/*TESTS*/
describe('plugin', () => {
	let sandbox;
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		
		sandbox.stub(browser, "createPost").yields();
	});
	afterEach(() => {
		sandbox.restore();
	});
	
	it('Should echo responses on Echo command', () => {
		const input = {
			post: {
				'topic_id': 12345,
				'post_number': 98765,
				input: 'this is input',
				command: 'a command',
				args: 'a b c',
				mention: 'mention',
				post: {
					cleaned: 'squeaky!'
				}
			}
		};
		
		plugin.prepare({'prefix': true}, config, fakeEmitter, browser);
		const result = fakeEmitter.emit("command#echo", input);
		result.should.be.true;
		browser.createPost.called.should.be.true;
		const output = browser.createPost.getCall(0).args[2];
		output.should.include('ECHO: this is input');
		
	});
});