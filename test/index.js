/**
 * hapi-session-inject test
 */

'use strict';
const Hapi = require('hapi');
const Session = require('../lib');

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const expect = Code.expect;
const fail = Code.fail;

const internals = {
	regex: new RegExp('(session=[^\x00-\x20\"\,\;\\\x7F]*)'),
	password: 'passwordmustbelongerthan32characterssowejustmakethislonger'
};

function init(server, maxCookieSize) {
	server.connection();
	server.route([
		{
			method: 'POST', path: '/',
			handler: (request, reply) => {
				request.yar.set('val', request.payload);
				reply();
			}
		},
		{
			method: 'GET', path: '/',
			handler: (request, reply) => {
				reply(request.yar.get('val'));
			}
		},
	]);

	const options = {
		maxCookieSize: maxCookieSize,
		cookieOptions: {
			password: internals.password,
			isSecure: false
		}
	};
	return server.register({ register: require('yar'), options })
		.then(() => {
			return server.initialize();
		});
}

describe("Client side storage with callback", () => {
	const server = new Hapi.Server();
	before(() => {
		return init(server, 1024);
	});
	it('should get back stored value', (done) => {
		const session = new Session(server);
		session.inject({ method: 'POST', url: '/', payload: '"one"'}, (res) => {
			session.inject({ method: 'GET', url: '/' }, (res2) => {
				expect(res2.result).to.equal('one');
				done();
			});
		});
	});
});

describe("Server side storage with promises", () => {
	const server = new Hapi.Server();
	before(() => {
		return init(server, 0);
	});
	it('should keep sessions separate', () => {
		const session1 = new Session(server);
		const session2 = new Session(server);
		return session1.inject({ method: 'POST', url: '/', payload: '"one"'})
			.then(() => {
				return session2.inject({ method: 'POST', url: '/', payload: '"two"'});
			})
			.then(() => {
				return session1.inject({ method: 'GET', url: '/' })
			})
			.then((res) => {
				expect(res.result).to.equal('one');
				return session2.inject({ method: 'GET', url: '/' })
			})
			.then((res) => {
				expect(res.result).to.equal('two');
			});
	});
});
