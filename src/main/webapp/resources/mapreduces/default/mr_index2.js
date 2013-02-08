//examples used are adapted from http://github.com/mongodb/mongo/blob/master/jstests/mr_index2.js

${namespace}.mapFunc = function() {
	emit(this._id, 1);
};

${namespace}.reduceFunc = function(k , vals) {
	return Array.sum( vals );
};

${namespace}.document = [
	{ arr : [1, 2] }
];