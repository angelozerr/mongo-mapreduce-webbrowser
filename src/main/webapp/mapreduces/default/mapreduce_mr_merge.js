//examples used are adapted from http://github.com/mongodb/mongo/blob/master/jstests/mr_merge.js

${namespace}.mapFunc = function() {
	for (i=0; i<this.a.length; i++ ) 
		emit( this.a[i] , 1 );
};

${namespace}.reduceFunc = function( key , vs ){ 
    return Array.sum( vs );
};

${namespace}.document = [
	{ a : [ 1 , 2 ] },
	{ a : [ 2 , 3 ] },
	{ a : [ 3 , 4 ] } 
];