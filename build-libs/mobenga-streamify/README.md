# Streamify

Streamify will create a stream for gulp from a function (it implement the _transform method of a Transform Stream).

```js
	var streamify = require('mobenga-streamify');

	gulp.pipe(streamify(function (file, _, done) {
   		// ... your magic ...
		this.push(file);
		done();
	}));
```


## Install

```bash
npm install --save-dev mobenga-streamify
```



