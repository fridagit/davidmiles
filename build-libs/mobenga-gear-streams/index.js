var folderStreams = require('mobenga-folder-streams');
var path = require('path');
var fs = require('fs');

function isValidGear(folder) {
	var pkgPath = path.join(folder, 'feature.json');
	return fs.existsSync(pkgPath);
}

function generateStream(task) {
	return function (folder) {

		var json;
		try {
			json = JSON.parse(fs.readFileSync(path.join(folder, 'feature.json')));
		} catch (e) {
			console.warn('Unable to parse feature.json in '+ folder+', ignoring gear.');
			return;
		}
		return task(folder, json)
	}
}

module.exports = function (rootFolders, generator, filters) {
	filters = [isValidGear].concat(filters || []);
	return folderStreams(rootFolders, filters, generateStream(generator));
};