var Transform = require('stream').Transform;
var util = require('util');

module.exports = function streamify(fn) {

	util.inherits(Streamify, Transform);

	function Streamify() {
		Transform.call(this, {
			objectMode: true
		});
	}
	Streamify.prototype._transform = function(file, _, done) {
		fn.call(this, file, _, done);

	};
	return new Streamify();
}
