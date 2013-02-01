//examples used are adapted from http://github.com/mongodb/mongo/blob/master/jstests/mr_merge.js

var mapreduce_mr_merge = {};

mapreduce_mr_merge.mapFunc = function() {
	for (i=0; i<this.a.length; i++ ) 
		emit( this.a[i] , 1 );
};

mapreduce_mr_merge.reduceFunc = function( key , vs ){ 
    return Array.sum( vs );
};

mapreduce_mr_merge.document = [
	{ a : [ 1 , 2 ] },
	{ a : [ 2 , 3 ] },
	{ a : [ 3 , 4 ] } 
];

mapreduce_mr_merge.name = 'mapreduce_mr_merge';
MapReduceExecutorManager.addExecutor(mapreduce_mr_merge);