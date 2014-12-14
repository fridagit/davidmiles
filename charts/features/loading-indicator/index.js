var layoutEngine = require('layout-engine');
exports.on = function () {
	layoutEngine.render('<div>Loading charts...</div>', {}, 'loading');
};

exports.off = function () {
	layoutEngine.render('<div></div>', {}, 'loading');
};