var streamify = require('mobenga-streamify');
var gulp = require('gulp');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

var streamqueue = require('streamqueue');

module.exports = function(template, data) { 

	var queue = streamqueue({ objectMode: true });

	function accessFileSync(files, opts, fn){
		return gulp.src(files, opts)
			.pipe(streamify(function(file, _, done){
				fn(file);
				done();
			}));
	}
	
	
	var templateText = fs.readFileSync(template, 'utf8');

	var tmp = {};
	Object.keys(data).forEach(function (key) {
		var conf = data[key];
		if(!tmp[key]){
		       	tmp[key] = [];
	       	}
		if(conf.asContent) {
			queue.queue(
				accessFileSync(conf.files, conf.opts || {}, function(file) {
					tmp[key].push(file.contents.toString('utf8'));
				})
			);
		}else { 
			queue.queue(	
				accessFileSync(conf.files, conf.opts || {}, function (file) {
					var filePath = '/' + path.relative(conf.opts.cwd, file.path);
					filePath = filePath.replace(/\\/g, '/');	// window machines
					tmp[key].push(filePath);
				})
			);
		}
		
	});

	var tmpl = handlebars.compile(templateText);

	var s = gulp.src(template);

	queue.queue(s);
 	return queue.done()
		.pipe(streamify(function (file, _, done) {
			file.contents = new Buffer(tmpl(tmp));
			this.push(file);
			done();
		}));
	
};

