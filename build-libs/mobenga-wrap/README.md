wraps a js module with cogwheels COMMONJS require statement

## install
```bash
npm install mobenga-wrap --save-dev
```

## usage
```js
var wrap = require('mobenga-wrap');

gulp.src('*.js')
	.pipe(wrap());

```
	
## PATCH NOTES

### 0.0.4
added line breaks when wrapping modules to not break on ending comments.
