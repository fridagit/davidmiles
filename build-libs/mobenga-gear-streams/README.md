Generate stream from gears.

## install

```bash
$ npm install mobenga-gear-streams --save-dev
```

## usage

```javascript
var gearStreams = require('mobenga-gear-streams');

gearStreams(gearDirs, streamGenerator, filters)
	// returns stream generated from gear folders
	.pipe(...);
```

## example

Reading markdown files from gears:

```javascript
function streamGenerator(folder, pkg) {
	return gulp.src(folder + '/*.md');
}

gearStreams(['gears/application', 'gears/domain'], streamGenerator)
	.pipe(size({ title: 'markdown', showFiles: true }));
```

Grab all JavaScript files from specific gear, using custom filter:

```javascript
function streamGenerator(folder, pkg) {
	return gulp.src(folder + '/*.js');
}

function isMyGear(folder) {
	return (path.basename(folder) === 'my-gear');
}

gearStreams(['gears/application', 'gears/domain'], streamGenerator, [isMyGear])
	.pipe(size({ title: 'js', showFiles: true }));
```
