#!/usr/bin/env node

var server = require('./lib/server');
var program = require('commander');
var pkg = require('./package');

program
	.version(pkg.version)
	.usage('[options] <dir ...>')
	.option('-p, --port <port>', 'Specify port.');

program.on('--help', function () {
	console.log('Defaults to port 4000.');
	console.log('');
});

program.parse(process.argv);

server({
	port: program.port || 4000,
	directory: program.args[0] || './'
});
