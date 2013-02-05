var index = 0;
var SubMapReduceExecutor = (function() {

	this.bsonTextarea = null;
	this.mapTextarea = null;
	this.reduceTextarea = null;
	this.finalizeTextarea = null;
	this.resultTextarea = null;
	return function() {

	};

})();

SubMapReduceExecutor.prototype.execute = function(name, index) {

	var namespace = name + index;
	var mapFuncName = namespace + '.mapFunc';
	var reduceFuncName = namespace + '.reduceFunc';

	var _this = this;
	var errorCallback = function(message) {
		_this.resultTextarea.value = message;
	};

	var jsonData = this.bsonTextarea.value;

	var jsonArray = null;
	try {
		jsonArray = BSON.parseStrict(jsonData);
	} catch (e) {
		errorCallback('Error BSON: ' + e);
		return;
	}

	try {
		eval('if(!' + namespace + '){var ' + namespace + '={};}' + mapFuncName
				+ '=' + this.mapTextarea.value);
	} catch (e) {
		errorCallback('Error Map: ' + e);
		return;
	}

	try {
		eval(reduceFuncName + '=' + this.reduceTextarea.value);
	} catch (e) {
		errorCallback('Error Reduce: ' + e);
		return;
	}

	// Finalize
	var finalizeFuncName = null;
	if (this.finalizeTextarea.value != '') {
		finalizeFuncName = namespace + '.finalizeFunc';
		try {
			eval(finalizeFuncName + '=' + this.finalizeTextarea.value);
		} catch (e) {
			errorCallback('Error Finalize: ' + e);
			return;
		}
	}

	try {
		var finalizeFunc = null;
		if (finalizeFuncName != null) {
			finalizeFunc = eval(finalizeFuncName);
		}
		var reduceResult = MR.doMapReduce(jsonArray, eval(mapFuncName),
				eval(reduceFuncName), finalizeFunc);
		var json = BSON.toString(reduceResult, null, '  ');
		this.resultTextarea.value = json;
	} catch (e) {
		errorCallback('Error while executing MapReduce: ' + e);
		return;
	}
};

var MapReduceExecutor = (function() {
	/*
	 * this.name = null; this.document = null; this.mapFunc = null;
	 * this.reduceFunc = null; this.finalizeFunc = null; this.script=null;
	 */
	return function() {
		for ( var i = 0; i < arguments.length; i++) {
			switch (i) {
			case 0:
				this.name = arguments[i];
				break;
			case 1:
				this.document = arguments[i];
				break;
			case 2:
				this.mapFunc = arguments[i];
				break;
			case 3:
				this.reduceFunc = arguments[i];
				break;
			case 4:
				this.finalizeFunc = arguments[i];
				break;
			default:
				break;
			}
		}
		this.executors = [];
		this.executors.push(new SubMapReduceExecutor());
	};
})();

MapReduceExecutor.prototype.execute = function() {
	for ( var i = 0; i < this.executors.length; i++) {
		executor = this.executors[i];
		executor.execute(this.name, i);
	}
};

MapReduceExecutor.prototype.save = function() {

	var fileName = this.name + '.js';

	var namespace = this.name + '0';
	var mapFuncName = namespace + '.mapFunc';
	var reduceFuncName = namespace + '.reduceFunc';
	var finalizeFuncName = namespace + '.finalizeFunc';
	var documentName = namespace + '.document';

	var jsContent = 'var ' + namespace + '={};';

	for ( var i = 0; i < this.executors.length; i++) {
		executor = this.executors[i];
		jsContent += '\n' + mapFuncName + '=' + executor.mapTextarea.value;
		jsContent += '\n' + reduceFuncName + '='
				+ executor.reduceTextarea.value;
		jsContent += '\n' + documentName + '=' + executor.bsonTextarea.value;
	}

	jsContent +='\n' + namespace + '.name="' + this.name + '";';
	jsContent +='\nMapReduceExecutorManager.addExecutor(' + namespace + ');';
	
	var _this = this;
	jQuery.ajax({
		type : 'GET',
		url : 'jaxrs/resources/save/' + fileName,
		data : {
			content : jsContent
		},
		success : function(data, textStatus, jqXHR) {
			_this.loadScript();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});
};

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

MapReduceExecutor.prototype.loadScript = function() {
	var fileName = this.name;
	if (fileName.startsWith('/')) {
		fileName = fileName.substring(1, fileName.length);
	}
	if (!fileName.endsWith('.js')) {
		fileName += '.js';
	}
	fileName = fileName.replace(/\//g, '%2F');
	var headID = document.getElementsByTagName("head")[0];

	var oldScript = this.script;
	if (oldScript != null) {
		headID.removeChild(oldScript)
	}
	var script = document.createElement('script');
	// script.type = 'text/javascript';
	index++;
	script.src = 'jaxrs/resources/load/' + fileName;
	// + '?i=' + index;

	headID.appendChild(script);
	this.script = script;
};

MapReduceExecutor.prototype.loadUI = function(parent) {

	var defaultDocument = this.document;
	var defaultMapFunc = this.mapFunc;
	var defaultReduceFunc = this.reduceFunc;
	var defaultFinalizeFunc = this.finalizeFunc;

	var _this = this;
	var mapReduceChanged = function() {
		_this.execute();
	}

	var saveButton = document.createElement('input');
	saveButton.type = 'button';
	saveButton.value = 'Save';
	saveButton.onclick = function() {
		_this.save();
	};
	parent.appendChild(saveButton);

	var executor = null;
	for ( var i = 0; i < this.executors.length; i++) {
		executor = this.executors[i];

		$(parent).append($('<h1>BSON Document</h1>'));

		// BSON textarea
		var textareaParent = document.createElement('div');
		var bsonTextarea = document.createElement('textarea');
		bsonTextarea.setAttribute("rows", "10");
		bsonTextarea.setAttribute("cols", "150");

		executor.bsonTextarea = bsonTextarea;
		textareaParent.appendChild(bsonTextarea);
		parent.appendChild(textareaParent);

		bsonTextarea.onkeyup = mapReduceChanged;
		bsonTextarea.onchange = mapReduceChanged;
		if (defaultDocument != null) {
			bsonTextarea.value = JSON.stringify(defaultDocument, null, '');
		}

		$(parent).append($('<h1>MapReduce</h1>'));
		var table = document.createElement('table');
		var tr = document.createElement('tr');

		// Map textarea
		var td = document.createElement('td');
		var fieldset = document.createElement('fieldset');
		var legend = document.createElement('legend');
		legend.appendChild(document.createTextNode('Map Function'));
		fieldset.appendChild(legend);

		var mapTextarea = document.createElement('textarea');
		mapTextarea.setAttribute("rows", "10");
		mapTextarea.setAttribute("cols", "75");
		mapTextarea.onkeyup = mapReduceChanged;
		mapTextarea.onchange = mapReduceChanged;
		if (defaultMapFunc != null) {
			mapTextarea.value = defaultMapFunc;
		}

		executor.mapTextarea = mapTextarea;
		fieldset.appendChild(mapTextarea);
		td.appendChild(fieldset);
		tr.appendChild(td);

		// Reduce textarea
		var td = document.createElement('td');
		var fieldset = document.createElement('fieldset');
		var legend = document.createElement('legend');
		legend.appendChild(document.createTextNode('Reduce Function'));
		fieldset.appendChild(legend);

		var reduceTextarea = document.createElement('textarea');
		reduceTextarea.setAttribute("rows", "10");
		reduceTextarea.setAttribute("cols", "75");
		reduceTextarea.onkeyup = mapReduceChanged;
		reduceTextarea.onchange = mapReduceChanged;
		if (defaultReduceFunc != null) {
			reduceTextarea.value = defaultReduceFunc;
		}
		executor.reduceTextarea = reduceTextarea;

		fieldset.appendChild(reduceTextarea);
		td.appendChild(fieldset);
		tr.appendChild(td);

		// Finalize textarea
		var td = document.createElement('td');
		var fieldset = document.createElement('fieldset');
		var legend = document.createElement('legend');
		legend.appendChild(document.createTextNode('Finalize Function'));
		fieldset.appendChild(legend);

		var finalizeTextarea = document.createElement('textarea');
		finalizeTextarea.setAttribute("rows", "10");
		finalizeTextarea.setAttribute("cols", "75");
		finalizeTextarea.onkeyup = mapReduceChanged;
		finalizeTextarea.onchange = mapReduceChanged;
		if (defaultFinalizeFunc != null) {
			finalizeTextarea.value = defaultFinalizeFunc;
		}
		executor.finalizeTextarea = finalizeTextarea;

		fieldset.appendChild(finalizeTextarea);
		td.appendChild(fieldset);
		tr.appendChild(td);

		table.appendChild(tr);
		parent.appendChild(table);

		$(parent).append($('<h1>Result</h1>'));

		// Result
		var resultTextarea = document.createElement('textarea');
		resultTextarea.setAttribute("rows", "10");
		resultTextarea.setAttribute("cols", "150");
		executor.resultTextarea = resultTextarea;
		parent.appendChild(resultTextarea);

	}

};
