js-exports will add module.exports

## install
```bash
npm install mobenga-js-exports --save-dev
```

## usage

```js

var jsexports = require('mobenga-js-exports');

gulp.src('*.json')
	.pipe(jsexports());

```
