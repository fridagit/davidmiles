// Express web server

var http = require('http');
var path = require('path');
var fs = require('fs');

var express = require('cogwheels-tools/node_modules/express');

var app = express();
var server = http.createServer(app);
var argv = process.argv;

// Settings
app.locals({
	rootDir: __dirname,
	publicDir: path.join(__dirname, 'builds/web/' + (argv[3] || 'development')),
	port: argv[2] ? parseInt(argv[2], 10) : 4000
});

// Parsing
app.use(express.bodyParser());
app.use(express.cookieParser());

// Static files
app.use(express.static(app.locals.publicDir));

// Fall back to index.html
app.use(function (req, res) {

	var textMode = { encoding: 'utf8' };

	fs.readFile(path.join(app.locals.publicDir, 'index.html'), textMode, function (err, html) {
		if (err) {
			res.send(500, err);
		}
		else {
			res.send(200, html);
		}
	});
});

// Start
server.listen(app.locals.port);

console.log('Web server listening on port ' + app.locals.port);
console.log('Public directory: ' + app.locals.publicDir);
