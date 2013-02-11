
${namespace}.mapFunc=function () {
  emit(this.CountryID,
	{ "data":
		[
			{
				"city": this.City,
				"lat":  this.Latitude,
				"lon":  this.Longitude
			}
		]
	});
}
${namespace}.reduceFunc=function (key, values) {
  var reduced = {"data":[]};
	for (var i in values) {
		var inter = values[i];
		for (var j in inter.data) {
			reduced.data.push(inter.data[j]);
		}
	}

	return reduced;
}
${namespace}.finalizeFunc=function (key, reduced) {

	if (reduced.data.length == 1) {
		return { "message" : "This Country contains only 1 City" };
	}

	var min_dist = 999999999999;
	var city1 = { "name": "" };
	var city2 = { "name": "" };

	var c1;
	var c2;
	var d;
	for (var i in reduced.data) {
		for (var j in reduced.data) {
			if (i>=j) continue;
			c1 = reduced.data[i];
			c2 = reduced.data[j];
			d = Math.sqrt((c1.lat-c2.lat)*(c1.lat-c2.lat)+(c1.lon-c2.lon)*(c1.lon-c2.lon));
			if (d < min_dist && d > 0) {
				min_dist = d;
				city1 = c1;
				city2 = c2;
			}
		}
	}

	return {"city1": city1.name, "city2": city2.name, "dist": min_dist};
}
${namespace}.document=[
    { "_id" : { "$oid" : "5118b7c85035feb3ae114fad" }, "CityId" : 42231, "CountryID" : 1, "RegionID" : 833, "City" : "Herat", "Latitude" : 34.333, "Longitude" : 62.2, "TimeZone" : "+04:30", "DmaId" : 0, "Code" : "HERA" } ,
    { "_id" : { "$oid" : "5118b7c85035feb3ae114fae" }, "CityId" : 5976, "CountryID" : 1, "RegionID" : 835, "City" : "Kabul", "Latitude" : 34.517, "Longitude" : 69.18300000000001, "TimeZone" : "+04:50", "DmaId" : 0, "Code" : "KABU" } ,
    { "_id" : { "$oid" : "5118b7c85035feb3ae114faf" }, "CityId" : 42230, "CountryID" : 1, "RegionID" : 852, "City" : "Mazar-e Sharif", "Latitude" : 36.7, "Longitude" : 67.09999999999999, "TimeZone" : "+4:30", "DmaId" : 0, "Code" : "MSHA" } 
    
  ]