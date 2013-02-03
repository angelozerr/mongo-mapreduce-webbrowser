//examples used are adapted from http://github.com/mongodb/mongo/blob/master/jstests/mr_index3.js

var mapreduce_mr_index3 = {};

mapreduce_mr_index3.mapFunc = function() {
	for ( var i=0; i<this.tags.length; i++ )
        emit( this.tags[i] , 1 )
};

mapreduce_mr_index3.reduceFunc = function( key , values ){ 
    return Array.sum( values );
};

mapreduce_mr_index3.document = [
	{ _id : 1, name : 'name1', tags : ['dog', 'cat'] },
	{ _id : 2, name : 'name2', tags : ['cat'] },
	{ _id : 3, name : 'name3', tags : ['mouse', 'cat', 'dog'] },
	{ _id : 4, name : 'name4', tags : [] }
];

mapreduce_mr_index3.name = 'mapreduce_mr_index3';
MapReduceExecutorManager.addExecutor(mapreduce_mr_index3);