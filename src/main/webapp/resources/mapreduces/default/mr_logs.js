
${namespace}.mapFunc=function () {
	print('map emitting on ' + tojson(this));
	emit({
		day : this.date.getDate(),
		url : this.url
	}, {
		count : 1
	});
}
${namespace}.reduceFunc=function (key, values) {
	var count = 0;

	values.forEach(function(v) {
		count += v['count'];
	});

	return {
		count : count
	};
}
${namespace}.document=[{"_id":{"$oid":"50d8fdedadd222278ba9090f"},"date":{"$date":"2012-12-25T01:14:21.312Z"},"url":"http;//iiiiiiiiiii"},{"_id":{"$oid":"50d8fdedadd222278ba90910"},"date":{"$date":"2012-12-25T01:14:21.312Z"},"url":"http;//hhhhhhhhh"},{"_id":{"$oid":"50d8fdedadd222278ba90911"},"date":{"$date":"2012-12-25T01:14:21.312Z"},"url":"http;//hhhhhhhhh"},{"_id":{"$oid":"50d8fdedadd222278ba90912"},"date":{"$date":"2012-12-25T01:14:21.312Z"},"url":"http;//hhhhhhhhh"},{"_id":{"$oid":"50d8fdedadd222278ba90913"},"date":{"$date":"2012-12-25T01:14:21.312Z"},"url":"http;//hhhhhhhhh"},{"_id":{"$oid":"50d8fdedadd222278ba90914"},"date":{"$date":"2012-12-25T01:14:21.312Z"},"url":"http;//hhhhhhhhh"},{"_id":{"$oid":"50d8fdedadd222278ba90915"},"date":{"$date":"2012-12-25T01:14:21.312Z"},"url":"http;//hhhhhhhhh"},{"_id":{"$oid":"50d8fdedadd222278ba90916"},"date":{"$date":"2012-12-25T01:14:21.312Z"},"url":"http;//hhhhhhhhh"}]