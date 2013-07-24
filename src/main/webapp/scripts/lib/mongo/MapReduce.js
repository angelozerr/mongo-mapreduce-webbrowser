// https://github.com/mongodb/mongo/blob/master/src/mongo/shell/mr.js
var MR = {};

MR.doMapReduce = function(jsonArray, mapFunc, reduceFunc, finalizeFunc) {
	MR.cleanup();

	var oldPrint = window.print;
	try {

		window.print = MR.print;

		// 1) Map step
		var jsonObject = null;
		for ( var idx = 0; idx < jsonArray.length; idx++) {
			jsonObject = jsonArray[idx];
			mapFunc.call(jsonObject);
		}

		// 2) Reduce step
		var reduceResult = [];
		var values = null;

		for ( var i = 0; i < $arr.length; i++) {
			var data = $arr[i];
			if (!data)
				continue;
			var r = reduceFunc(data.key, data.values.slice(0, data.count));
			if (r && r.length && r[0]) {
				data.values = r;
				data.count = r.length;
			} else {
				data.values[0] = r;
				data.count = 1;
			}
			if (data.count == 1) {
				reduceResult.push({
					_id : data.key,
					value : data.values[0]
				});
			} else {
				reduceResult.push({
					_id : data.key,
					value : data.values.slice(0, data.count)
				});
			}
		}

		// Finalize step
		if (finalizeFunc) {
			var finalizeResult = [];
			reduceResult.forEach(function(z) {
				z.value = finalizeFunc(z._id, z.value);
				finalizeResult.push(z);
			});
			reduceResult = finalizeResult;
		}
	} catch (e) {
		throw e;
	} finally {
		window.print = oldPrint;
	}
	return reduceResult;
};

MR.getMapData = function(jsonArray, mapFunc) {
	MR.cleanup();

	var oldPrint = window.print;
	try {

		window.print = MR.print;

		// 1) Map step
		var jsonObject = null;
		for ( var idx = 0; idx < jsonArray.length; idx++) {
			jsonObject = jsonArray[idx];
			mapFunc.call(jsonObject);
		}

		// 2) Reduce step
		for ( var i = 0; i < $arr.length; i++) {
			var data = $arr[i];
			if (!data)
				continue;
			return data;
		}
	} catch (e) {
		throw e;
	} finally {
		window.print = oldPrint;
	}
	return null;
}

MR.init = function() {
	$max = 0;
	$arr = [];
	$arrKey = [];
	$nbKeys = 0;
	emit = MR.emit;
	// print = MR.print;
	tojson = MR.tojson;
	$numEmits = 0;
	$numReduces = 0;
	$numReducesToDB = 0;
	// gc(); // this is just so that keep memory size sane
}

MR.cleanup = function() {
	MR.init();
	// gc();
}

MR.emit = function(k, v) {
	// k = BSON.toString(k);
	// if (!(k in $mapResult)) {
	// $mapResult[k] = [];
	// }
	// $mapResult[k].push(v);
	// $numEmits++;
	var num = MR.getNum(k);
	var data = $arr[num];
	if (!data) {
		data = {
			key : k,
			values : new Array(1000),
			count : 0
		};
		$arr[num] = data;
	}
	data.values[data.count++] = v;
	$max = Math.max($max, data.count);
}

MR.getNum = function(k) {
	k = BSON.toString(k);
	var num = $arrKey[k];
	if (typeof num === "undefined") {
		num = $nbKeys++;
		$arrKey[k] = num;
	}
	return num;
};

MR.doReduce = function(useDB) {
	$numReduces++;
	if (useDB)
		$numReducesToDB++;
	$max = 0;
	for ( var i = 0; i < $arr.length; i++) {
		var data = $arr[i];
		if (!data)
			continue;

		if (useDB) {
			var x = tempcoll.findOne({
				_id : data.key
			});
			if (x) {
				data.values[data.count++] = x.value;
			}
		}

		var r = $reduce(data.key, data.values.slice(0, data.count));
		if (r && r.length && r[0]) {
			data.values = r;
			data.count = r.length;
		} else {
			data.values[0] = r;
			data.count = 1;
		}

		$max = Math.max($max, data.count);

		if (useDB) {
			if (data.count == 1) {
				tempcoll.save({
					_id : data.key,
					value : data.values[0]
				});
			} else {
				tempcoll.save({
					_id : data.key,
					value : data.values.slice(0, data.count)
				});
			}
		}
	}
}

MR.check = function() {
	if ($max < 2000 && $arr.length < 1000) {
		return 0;
	}
	MR.doReduce();
	if ($max < 2000 && $arr.length < 1000) {
		return 1;
	}
	MR.doReduce(true);
	$arr = [];
	$max = 0;
	reset_num();
	gc();
	return 2;
}

MR.finalize = function() {
	tempcoll.find().forEach(function(z) {
		z.value = $finalize(z._id, z.value);
		tempcoll.save(z);
	});
}

// Functions used in MapReduce

// copie de tojosn de
// https://github.com/mongodb/mongo/blob/master/src/mongo/shell/utils.js
MR.tojsononeline = function(x) {
	return tojson(x, " ", true);
}

MR.tojson = function(x, indent, nolint) {
	if (x === null)
		return "null";

	if (x === undefined)
		return "undefined";

	if (!indent)
		indent = "";

	switch (typeof x) {
	case "string": {
		var s = "\"";
		for ( var i = 0; i < x.length; i++) {
			switch (x[i]) {
			case '"':
				s += '\\"';
				break;
			case '\\':
				s += '\\\\';
				break;
			case '\b':
				s += '\\b';
				break;
			case '\f':
				s += '\\f';
				break;
			case '\n':
				s += '\\n';
				break;
			case '\r':
				s += '\\r';
				break;
			case '\t':
				s += '\\t';
				break;

			default: {
				var code = x.charCodeAt(i);
				if (code < 0x20) {
					s += (code < 0x10 ? '\\u000' : '\\u00') + code.toString(16);
				} else {
					s += x[i];
				}
			}
			}
		}
		return s + "\"";
	}
	case "number":
	case "boolean":
		return "" + x;
	case "object": {
		var s = tojsonObject(x, indent, nolint);
		if ((nolint == null || nolint == true) && s.length < 80
				&& (indent == null || indent.length == 0)) {
			s = s.replace(/[\s\r\n ]+/gm, " ");
		}
		return s;
	}
	case "function":
		return x.toString();
	default:
		throw "tojson can't handle type " + (typeof x);
	}

}

tojsonObject = function(x, indent, nolint) {
	var lineEnding = nolint ? " " : "\n";
	var tabSpace = nolint ? "" : "\t";

	// assert.eq( ( typeof x ) , "object" , "tojsonObject needs object, not [" +
	// ( typeof x ) + "]" );

	if (!indent)
		indent = "";

	if (typeof (x.tojson) == "function" && x.tojson != tojson) {
		return x.tojson(indent, nolint);
	}

	if (x.constructor && typeof (x.constructor.tojson) == "function"
			&& x.constructor.tojson != tojson) {
		return x.constructor.tojson(x, indent, nolint);
	}

	if (x.toString() == "[object MaxKey]")
		return "{ $maxKey : 1 }";
	if (x.toString() == "[object MinKey]")
		return "{ $minKey : 1 }";

	var s = "{" + lineEnding;

	// push one level of indent
	indent += tabSpace;

	var total = 0;
	for ( var k in x)
		total++;
	if (total == 0) {
		s += indent + lineEnding;
	}

	var keys = x;
	if (typeof (x._simpleKeys) == "function")
		keys = x._simpleKeys();
	var num = 1;
	for ( var k in keys) {

		var val = x[k];
		// if ( val == DB.prototype || val == DBCollection.prototype )
		// continue;

		s += indent + "\"" + k + "\" : " + tojson(val, indent, nolint);
		if (num != total) {
			s += ",";
			num++;
		}
		s += lineEnding;
	}

	// pop one level of indent
	indent = indent.substring(1);
	return s + indent + "}";
}

MR.print = function(txt) {
	if (console) {
		console.log(txt);
	}
};

// Array.prototype.max = function() {
// return Math.max.apply({}, this)
// }
// Array.prototype.min = function() {
// return Math.min.apply({}, this)
// }
