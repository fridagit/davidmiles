var connect = require('connect');
var modRewrite = require('connect-modrewrite');
var serveStatic = require('serve-static');
var compression = require('compression');
var app = connect();

module.exports = function (options) {
	options = options || {};

	var port = process.env.PORT || options.port;
	var directory = options.directory || './';
	var modRewrites = options.modRewrites || [
		'!\\.html|\\.js|\\.css|\\.png|\\.svg|\\.eot|\\.ttf|\\.woff /index.html [L]'
	];

	app.use(modRewrite(modRewrites));
	app.use(compression());
	app.use(serveStatic(directory));

	app.listen(port, function () {
		console.log('\nHosting app in directory ' + directory + ' on port ' + port + '\n');
	});
};
