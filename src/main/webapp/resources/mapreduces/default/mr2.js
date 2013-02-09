
${namespace}.mapFunc=function () {
    print('map emitting on ' + tojson(this));
	for ( var i = 0; i < this.comments.length; i++ ) {
        var c = this.comments[i];
        emit( c.who , { totalSize: c.txt.length, num: 1 } );
    }
}
${namespace}.reduceFunc=function (who, values) {
	print('reduce called on key ' + tojson(who) + ' with values ' + tojson(values));
	if (!(values instanceof Array))
		return values;
	var n = { totalSize: 0, num: 0 };
    for ( var i = 0; i < values.length; i++ ) {
        n.totalSize += values[i].totalSize;
        n.num += values[i].num;
    }
    return n;
}
${namespace}.document=[{"comments":[{"who":"a","txt":"asdasdasd"},{"who":"b","txt":"asdasdasdasdasdasdas"}]},
 {"comments":[{"who":"b","txt":"asdasdasdaaa"},{"who":"c","txt":"asdasdasdaasdasdas"}]}]