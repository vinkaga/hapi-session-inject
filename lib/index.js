/**
 * hapi-session-inject
 * Hapi inject with session
 * @exports {Class} Session
 */

'use strict';

class Session {
	/**
	 * Create a new session
	 * @param {Object} hapi - server instance
	 * @param {String} [cookie] - cookie cookie defaults to session
	 */
	constructor(hapi, cookie = 'session') {
		if (!hapi) {
			throw Error('Hapi server instance is required');
		}
		this.hapi = hapi;
		this.cookie = cookie;
	}

	/**
	 *
	 * @param {Object} options
	 * @param {Function} [callback]
	 * @returns {Promise}
	 */
	inject(options, callback) {
		if (this.header) {
			const opt = Object.assign({}, options);
			opt.headers = Object.assign({}, this.header, opt.headers);
			return this.hapi.inject(opt, callback);
		}
		if (!callback) {
			return this.hapi.inject(options).then((res) => {
				this.setHeader(res);
				return Promise.resolve(res);
			});
		}
		this.hapi.inject(options, (res) => {
			this.setHeader(res);
			callback(res);
		})
	}

	/**
	 * Set header from response
	 * @param {Object} res
	 */
	setHeader(res) {
		const header = res.headers['set-cookie'];
		if (header) {
			const regex = new RegExp('(' + this.cookie + '=[^\x00-\x20\"\,\;\\\x7F]*)');
			const cookie = header[0].match(regex);
			if (cookie[1]) {
				this.header = { cookie: cookie[1] };
			}
		}
	}
}

module.exports = Session;
