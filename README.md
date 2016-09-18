# Hapi-Session-Inject

A simple plugin for testing sessions using Hapi.

![Build Status](https://travis-ci.org/vinkaga/hapi-session-inject.svg?branch=master)


## Install

```
npm install --save-dev hapi-session-inject
```

## Usage

The ***hapi-session-inject*** [hapi](https://github.com/hapijs/hapi) plugin adds session support to [`server.inject`](http://hapijs.com/api#serverinjectoptions-callback).

The ***hapi-session-inject*** provides the same interface as [`server.inject`](http://hapijs.com/api#serverinjectoptions-callback). 

```JavaScript
	const server = new Hapi.Server();
	const session = new Session(server);
	
	// Callback interface
	session.inject('/', (res) => {
		...
	});
	
	// Promise interface
	return session.inject('/').then((res) => {
		...
	});

```

Additional usage details can be found in [test.js](test/index.js)
