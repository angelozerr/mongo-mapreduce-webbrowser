//examples used are adapted from http://github.com/mongodb/mongo/blob/master/jstests/mr_index2.js

var mapreduce_mr_index2 = {};

mapreduce_mr_index2.mapFunc = function() {
	emit(this._id, 1);
};

mapreduce_mr_index2.reduceFunc = function(k , vals) {
	return Array.sum( vals );
};

mapreduce_mr_index2.document = [
	{ arr : [1, 2] }
];

mapreduce_mr_index2.name = 'mapreduce_mr_index2';
MapReduceExecutorManager.addExecutor(mapreduce_mr_index2);