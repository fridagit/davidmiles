Streaming API to bundle your gears.

## install

```bash
$ npm install mobenga-bundle-gears --save-dev
```

## usage

```javascript
bundleGears.source(gearDirs, config)
	// returns stream of js-bundles
	.pipe(...);
```

```javascript
bundleGears.fixtures(gearDirs, config)
	// returns stream of bundled fixtures
	.pipe(...);
```

Note: bundle specs functionality is deprecated since version 1.2.0 since Sonar analysis requires that each test is 
in its own file, with same file name as its "describe" function name.

```javascript
bundleGears.specs(gearDirs, config)
	// returns stream of bundled tests
	.pipe(...);
```

## example

Bundle all gears together with minification:

```javascript
bundleGears.source(['gears/application', 'gears/domain'])
	.pipe(concat('gears.js'))
	.pipe(uglify())
	.pipe(gulp.dest('builds/gears'));
```

Changing config for html minify:

```javascript
bundleGears.source(['gears'], {htmlMin: {
	removeComments: true // removing comments (default is to keep)
}});
```

Enabling source maps:

```javascript
bundleGears.source(['gears'], {sourceMaps: true)
	.pipe(sourcemaps.write('../maps'));
```

Applying custom filter:

```javascript
function isMyGear(dir) {
	return (path.basename(dir) === 'my-gear');
}

bundleGears.source(['gears'], { filters: [isMyGear] })
	.pipe(concat('gears.js'))
	.pipe(gulp.dest('builds/gears'));
```

Example gear folder structure with fixtures:

    |-simpleGearExample
        |-index.js
        |-test
            |-specs
                |-exampleTest.js
            |-fixtures
                |-exampleFixture.js
                
In this example, using bundleGears.source on the folder containing simpleGearExample will bundle the files and 
*exclude* the whole test folder.