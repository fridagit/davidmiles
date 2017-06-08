Generate stream from folders

## install
```bash
npm install mobenga-folder-streams --save-dev
```

## usage

```js

var folderStreams = require('mobenga-folder-streams');

folderStreams(folderDir, filters, streamGenerator)
			// returns stream generated from folders
			.pipe(...);
```


## example

```js

// myFolders/foo/foo.js
// myFolders/bar/bar.js
// myFolders/ignore/ignore.js

function shouldInclude(folder) {
	return folder.indexOf('ignore')===-1;
}


folderStreams([myFolders], [shouldInclude],
	function (folder) {
		return gulp.src(folder + '/**/.js');
	})
	// stream containing foo.js and bar.js
	.pipe(...);
```



