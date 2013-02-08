var SubMapReduceExecutor = (function() {

	this.bsonEditor = null;
	this.mapTextarea = null;
	this.reduceTextarea = null;
	this.finalizeTextarea = null;
	this.resultTextarea = null;
	return function() {
		this.ownerExecutor = arguments[0];
	};

})();

SubMapReduceExecutor.prototype.execute = function(index) {

	var namespace = this.ownerExecutor.namespaceName;
	var mapFuncName = namespace + '.mapFunc';
	var reduceFuncName = namespace + '.reduceFunc';

	var _this = this;
	var errorCallback = function(message) {
		_this.ownerExecutor.setError(message);
		_this.resultTextarea.value = message;
	};

	var jsonData = this.bsonEditor.getValue();

	var jsonArray = null;
	try {
		jsonArray = BSON.parseStrict(jsonData);
	} catch (e) {
		errorCallback('Error BSON: ' + e);
		return;
	}

	var dirty = this.ownerExecutor.dirty;
	if (dirty) {
		try {
			eval('if(!' + namespace + '){var ' + namespace + '={};}'
					+ mapFuncName + '=' + this.mapTextarea.value);
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
	}

	// Finalize
	var finalizeFuncName = null;
	if (this.finalizeTextarea.value != '') {
		finalizeFuncName = namespace + '.finalizeFunc';
		if (dirty) {
			try {
				eval(finalizeFuncName + '=' + this.finalizeTextarea.value);
			} catch (e) {
				errorCallback('Error Finalize: ' + e);
				return;
			}
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
	return function() {
		this.dirty = false;
		for ( var i = 0; i < arguments.length; i++) {
			switch (i) {
			case 0:
				this.file = arguments[i];
				break;
			case 1:
				this.namespaceName = arguments[i];
				break;
			case 2:
				this.name = arguments[i];
				break;
			case 3:
				this.document = arguments[i];
				break;
			case 4:
				this.mapFunc = arguments[i];
				break;
			case 5:
				this.reduceFunc = arguments[i];
				break;
			case 6:
				this.finalizeFunc = arguments[i];
				break;
			default:
				break;
			}
		}
		this.executors = [];
		this.executors.push(new SubMapReduceExecutor(this));
	};
})();

/**
 * Returns true if the editor page is valid and false otherwise.
 * 
 * @returns Boolean
 */
MapReduceExecutor.prototype.isValid = function() {
	return this.error == null;
};

MapReduceExecutor.prototype.isDirty = function() {
	return this.dirty == true;
};

MapReduceExecutor.prototype.setDirty = function(dirty) {
	var oldDirty = this.dirty;
	this.dirty = dirty;
	if (dirty != oldDirty) {
		this.onDirtyChanged(this);
	}
};

MapReduceExecutor.prototype.setError = function(error) {
	this.error = error;
	this.onErrorChanged(this);
};

MapReduceExecutor.prototype.execute = function() {
	this.setError(null);
	if (this.isDirty()) {
		this.saveButton.button("enable");
	}
	for ( var i = 0; i < this.executors.length; i++) {
		executor = this.executors[i];
		executor.execute(i);
	}

	if (!this.isValid()) {
		this.saveButton.button("disable");
	}
};

MapReduceExecutor.prototype.save = function() {

	var fileName = this.file;

	var namespace = '${namespace}';
	var mapFuncName = namespace + '.mapFunc';
	var reduceFuncName = namespace + '.reduceFunc';
	var finalizeFuncName = namespace + '.finalizeFunc';
	var documentName = namespace + '.document';

	var jsContent = '';

	for ( var i = 0; i < this.executors.length; i++) {
		executor = this.executors[i];
		jsContent += '\n' + mapFuncName + '=' + executor.mapTextarea.value;
		jsContent += '\n' + reduceFuncName + '='
				+ executor.reduceTextarea.value;
		jsContent += '\n' + documentName + '=' + executor.bsonEditor.getValue();
	}

	var _this = this;
	jQuery.ajax({
		type : 'GET',
		url : 'jaxrs/resources/save',
		data : {
			fileName : fileName,
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
	var fileName = this.file;
	var headID = document.getElementsByTagName("head")[0];

	var oldScript = this.script;
	if (oldScript != null) {
		headID.removeChild(oldScript)
	}
	var script = document.createElement('script');
	// script.type = 'text/javascript';
	script.src = 'jaxrs/resources/load?fileName=' + fileName;
	// + '?i=' + index;

	headID.appendChild(script);
	this.script = script;
};

MapReduceExecutor.prototype.createUI = function(parent) {

	var defaultDocument = this.document;
	var defaultMapFunc = this.mapFunc;
	var defaultReduceFunc = this.reduceFunc;
	var defaultFinalizeFunc = this.finalizeFunc;

	var _this = this;

	// Toolbar
	var toolbarDiv = document.createElement('div');
	toolbarDiv.className = "toolbar ui-corner-all";

	// Save button
	var saveButton = document.createElement('button');
	saveButton.appendChild(document.createTextNode('Save MapReduce'));
	$(saveButton).button({
		text : false,
		disabled : true,
		icons : {
			primary : "ui-icon-disk"
		}
	}).click(function() {
		_this.save();
	});
	this.saveButton = $(saveButton);
	toolbarDiv.appendChild(saveButton);

	// Execute button
	var executeButton = document.createElement('button');
	executeButton.appendChild(document.createTextNode('Execute MapReduce'));
	toolbarDiv.appendChild(executeButton);
	$(executeButton).button({
		text : false,
		icons : {
			primary : "ui-icon-play"
		}
	}).click(function() {
		_this.execute();
	});

	parent.appendChild(toolbarDiv);

	// Create textareas
	var mapReduceChanged = function() {
		_this.setDirty(true);
		_this.execute();
	}

	var executor = null;
	for ( var i = 0; i < this.executors.length; i++) {
		executor = this.executors[i];

		$(parent).append($('<h1>BSON Document</h1>'));

		// BSON textarea
		var textareaParent = document.createElement('div');
		var bsonEditor = new BSONEditor(textareaParent);
		if (defaultDocument != null) {
			bsonEditor.setValue(JSON.stringify(defaultDocument, null, ''));
		}
		bsonEditor.addChangeListener(mapReduceChanged);
		executor.bsonEditor = bsonEditor;
		parent.appendChild(textareaParent);

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
