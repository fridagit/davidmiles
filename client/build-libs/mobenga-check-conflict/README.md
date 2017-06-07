Checks gears for conflicts with cogwheels

## install

```
npm install --save-dev mobenga-check-conflict
```

## usage

```
gulp.task('conflict', function () {
	return gulp.src(['gears/**/feature.json'])
		.pipe(conflict());
});
```