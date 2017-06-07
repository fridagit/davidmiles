Use handlebars to generate output based on a template

## install
```bash
npm install mobenga-handlebars-stream --save-dev
```

## usage
```
var handlebarsStream = require('mobenga-handlebars-stream');

var data = {
	someProperty: { files: ['lib/**/*.js'], opts: { cwd: 'base' }},
	someOtherProperty: { files: ['extras/one.js'], asContent: true }
};

handlebarsStream('my-template.html', data)
	.pipe('index.html')
	.pipe(gulp.dest('builds'));

``` 