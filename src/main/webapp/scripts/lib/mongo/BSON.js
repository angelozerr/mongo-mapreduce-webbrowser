/**
 * @see http://api.mongodb.org/wiki/current/Mongo%20Extended%20JSON.html
 */
var BSON = {};

BSON.parseStrict = (function () {
    "use strict";
    
    return function(text) {
    	return JSON.parse(text, function (key, value) {
    		// $date
    		var v = value["$date"];
  			if (v) {
  				return new Date(Date.parse(v));
  			}
  			// $oid
  			v = value["$oid"];
  			if(v) {
  				return new ObjectId(v);
  			}		    
		    return value;
		});
    };
}());

BSON.toString = function (obj, replacer, space) {
    // Since regular JSON is a strict subset of JSON5, we'll always output
    // regular JSON to foster better interoperability. TODO Should we not?
    return JSON.stringify.apply(JSON, arguments);
};