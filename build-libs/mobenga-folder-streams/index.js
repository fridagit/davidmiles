var es = require('event-stream');
var fs = require('fs');
var path = require('path');
var Stream = require('stream');


function concatStreams(streams) {
	streams = streams.filter(function (stream) {
		return !!stream;
	});
	// no folder stream found, create a passthrough stream and end it so clients know task is done
	if (streams.length === 0) {
		var stream = Stream.PassThrough({ objectMode: true });
		stream.end();
		return stream;
	}
	return es.concat.apply(null, streams)
}

function isDirFilter(dir) {
	return fs.statSync(dir).isDirectory();
}

function applyFilters(arr, filters) {
	filters.forEach(function (filter) {
		arr = arr.filter(filter)
	});

	return arr;
}

function generateStream(folders, streamGenerator) {
	var streams = folders.map(streamGenerator);
	return concatStreams(streams);
}


module.exports = function (rootFolders, filters, streamGenerator) {

	filters = filters || [];
	filters.unshift(isDirFilter);

	var streams = rootFolders.map(function (rootFolder) {

		var folders = fs.readdirSync(rootFolder).map(function (folder) {
			return path.join(rootFolder, folder).replace(/\\/g, '/');
		});

		folders = applyFilters(folders, filters);

		if (folders.length === 0) {
			return null;
		}

		return generateStream(folders, streamGenerator);

	});

	return concatStreams(streams);
};

