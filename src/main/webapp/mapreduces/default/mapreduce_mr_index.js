//examples used are adapted from http://github.com/mongodb/mongo/blob/master/jstests/mr_index.js

var mapreduce_mr_index = {};

mapreduce_mr_index.mapFunc = function() {
	for ( i=0; i<this.tags.length; i++ )
        emit( this.tags[i] , 1 );
};

mapreduce_mr_index.reduceFunc = function(k , vs) {
	return Array.sum( vs );
};

mapreduce_mr_index.document = [
	{ tags : [ 1  ] },
	{ tags : [ 1 , 2  ] },
	{ tags : [ 1 , 2 , 3 ] },
	{ tags : [ 3 ] },
	{ tags : [ 2 , 3 ] },
	{ tags : [ 2 , 3 ] },
	{ tags : [ 1 , 2 ] }
];

mapreduce_mr_index.name = 'mapreduce_mr_index';
MapReduceExecutorManager.addExecutor(mapreduce_mr_index);