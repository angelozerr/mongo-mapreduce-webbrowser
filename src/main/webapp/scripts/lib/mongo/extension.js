if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function(str) {
		return this.slice(0, str.length) == str;
	};
};

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(pattern) {
		var d = this.length - pattern.length;
		return d >= 0 && this.lastIndexOf(pattern) === d;
	};
};

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fun /* , thisp */) {
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();

		var thisp = arguments[1];
		for ( var i = 0; i < len; i++) {
			if (i in this)
				fun.call(thisp, this[i], i, this);
		}
	};
}

if (!Array.sum) {

	Array.sum = function(array) {
		for ( var i = 0, sum = 0; i < array.length; sum += array[i++])
			;
		return sum;
	};
}