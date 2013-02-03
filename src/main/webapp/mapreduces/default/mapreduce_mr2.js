//examples used are adapted from http://github.com/mongodb/mongo/blob/master/jstests/mr2.js

var mapreduce_mr2 = {};

mapreduce_mr2.mapFunc = function() {
    print('map emitting on ' + tojson(this));
	for ( var i = 0; i < this.comments.length; i++ ) {
        var c = this.comments[i];
        emit( c.who , { totalSize: c.txt.length, num: 1 } );
    }
};

mapreduce_mr2.reduceFunc = function(who, values) {
	print('reduce called on key ' + tojson(who) + ' with values ' + tojson(values));
	if (!(values instanceof Array))
		return values;
	var n = { totalSize: 0, num: 0 };
    for ( var i = 0; i < values.length; i++ ) {
        n.totalSize += values[i].totalSize;
        n.num += values[i].num;
    }
    return n;
};

mapreduce_mr2.finalizeFunc = function( who, res ) {
	print('finalize called on key ' + tojson(who) + ' with value ' + tojson(res));
    res.avg = res.totalSize / res.num;
    return res;
};

mapreduce_mr2.document = [ {
	comments : [ {
		who : "a",
		txt : "asdasdasd"
	}, {
		who : "b",
		txt : "asdasdasdasdasdasdas"
	} ]
}, {
	comments : [ {
		who : "b",
		txt : "asdasdasdaaa"
	}, {
		who : "c",
		txt : "asdasdasdaasdasdas"
	} ]
} ];

mapreduce_mr2.name = 'mapreduce_mr2';
MapReduceExecutorManager.addExecutor(mapreduce_mr2);