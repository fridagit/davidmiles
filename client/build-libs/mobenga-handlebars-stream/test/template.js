var handlebarsStream = require('../index');
var expect = require('chai').expect;

describe('handlebars stream', function() {
	it('should add data as path to template', function(done) {
		var data = {
			libs: { files: ['lib/*.js'], opts: { cwd: 'test/fixture' } }
		};

		var output = '';
		var stream = handlebarsStream('test/sample.template.html', data);

		stream.on('data', function (file) {
			output = file.contents.toString('utf8');
		});

		stream.on('end', function () {
			expect(output).to.equal('/lib/a.js');
			done();
		});	
	}); 
	it('should add data as content to template', function(done) {
		
		var data = {
			libs: { files: ['lib/a.js'], opts: { cwd: 'test/fixture' }, asContent: true }
		};

		var output = '';
		var stream = handlebarsStream('test/sample.template.html', data);

		stream.on('data', function (file) {
			output = file.contents.toString('utf8');
		});

		stream.on('end', function () {
			expect(output).to.equal('var i = 0;');
			done();
		});	
	}); 

	it('should not escape chars when used as content', function(done) {
		
		var data = {
			libs: { files: ['extra/b.js'], opts: { cwd: 'test/fixture' }, asContent: true }
		};

		var output = '';
		var stream = handlebarsStream('test/sample.content.template.html', data);

		stream.on('data', function (file) {
			output = file.contents.toString('utf8');
		});

		stream.on('end', function () {

			expect(output).to.equal("require('message-bus').subscribe('.', console.log.bind(console));");
			done();
		});	
	}); 

});