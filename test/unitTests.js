'use strict';
/*globals describe, it*/

const chai = require('chai');
const sinon = require('sinon');
	
//promise library plugins
require('sinon-as-promised');
require('chai-as-promised');

chai.should();
const expect = chai.expect;

const plugin = require('../src/plugin');

//For mocking out the mergeObjects bit of prepare()
const fakeConfig = {
	mergeObjects: sinon.stub().returns({
		db: './mafiadbTesting'
	})
};

//Fake the response object exposed by SockBot
const browser = {
	createPost: sinon.stub().yields()
};

//And the events object
const events = {
	onCommand: sinon.stub().yields(),
	onNotification: sinon.stub.yields()
};

describe('plugin', () => {
	let sandbox;
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		
		browser.createPost.reset();
		events.onCommand.reset();
		events.onNotification.reset();
	});
	afterEach(() => {
		sandbox.restore();
	});
	
	it('should export prepare()', () => {
		expect(plugin.prepare).to.be.a('function');
	});
	it('should export start()', () => {
		expect(plugin.start).to.be.a('function');
	});
	it('should export stop()', () => {
		expect(plugin.stop).to.be.a('function');
	});
	it('should have start() as a stub function', () => {
		expect(plugin.start).to.not.throw();
	});
	it('should have stop() as a stub function', () => {
		expect(plugin.stop).to.not.throw();
	});
	
	describe('prepare()', () => {
		it('Should register commands', () => {			
			plugin.prepare({'prefix': true}, fakeConfig, events, undefined);
			events.onCommand.calledWith('echo').should.be.true;
		});
		
		it('Should handle empty config gracefully', () => {			
			plugin.prepare(null, fakeConfig, events, undefined);
			events.onCommand.calledWith('echo').should.be.true;
		});
	});
	
	describe('echo()', () => {

		it('should echo what is passed in', () => {
			const command = {
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

			plugin.internals.browser = browser;
			plugin.internals.configuration = {
				prefix: true
			};

			return plugin.echoHandler(command).then( () => {
				browser.createPost.calledWith(command.post.topic_id, command.post.post_number).should.be.true;
				const output = browser.createPost.getCall(0).args[2];
				output.should.include('ECHO: this is input');
			});
		});
		
		it('should be able to echo without a prefix', () => {
			const command = {
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

			plugin.internals.browser = browser;
			plugin.internals.configuration = {
				prefix: false
			};

			return plugin.echoHandler(command).then( () => {
				browser.createPost.calledWith(command.post.topic_id, command.post.post_number).should.be.true;
				const output = browser.createPost.getCall(0).args[2];
				output.should.include('this is input');
			});
		});
	});
});
