/**
 * Creates a new BSONEditor.
 * 
 * @param parent
 *            HTML element parent where the editor should be added.
 * @constructor
 */
function BSONEditor(parent, titleLabel, editable) {
	this.editable = editable;
	this.bsonTextarea = this._createUI(parent, titleLabel, editable);
};

/**
 * Create the UI.
 */
BSONEditor.prototype._createUI = function(parent, titleLabel, /* Boolean */ editable) {

	var toolbarDiv = document.createElement('div');
	// title
	var title = document.createElement('span');
	title.className = "title-editor";
	title.appendChild(document.createTextNode(titleLabel));
	toolbarDiv.appendChild(title);	
	
	// Format button
	var _this = this;
	var formatButton = document.createElement('input');
	formatButton.type='button';
	formatButton.value='Format';
	formatButton.onclick = function() {
		_this.format();
	};
	toolbarDiv.appendChild(formatButton);

	// URL field
	var hasURLField = false;
	if (hasURLField) {
		var urlInput = document.createElement('input');
		urlInput.type = 'text';
		toolbarDiv.appendChild(urlInput);
		
		var loadBSON = function() {
			alert(urlInput.value);
		};
		
		var urlDropdown = document.createElement('a');
		urlDropdown.href = "#";
		urlDropdown.onclick = loadBSON;
		urlDropdown.appendChild(document.createTextNode("OK"));
		toolbarDiv.appendChild(urlDropdown);
	}
	parent.appendChild(toolbarDiv);
		
	var containerDiv = document.createElement('div');
	containerDiv.className = "bson-editor-container";	
	
	var bsonTextarea = document.createElement('textarea');
	//bsonTextarea.setAttribute("rows", "10");
	//bsonTextarea.setAttribute("cols", "150");
	containerDiv.appendChild(bsonTextarea);
	parent.appendChild(containerDiv);
	
	return bsonTextarea;
};

/**
 * Set value of the editor.
 * 
 * @param value
 *            the value to set.
 */
BSONEditor.prototype.setValue = function(value) {
	if (this.codeMirror) {
		this.codeMirror.setValue(value)
	} else {
		this.bsonTextarea.value = value;
	}
};

/**
 * Returns the value of the editor.
 * 
 * @returns the value of the editor.
 */
BSONEditor.prototype.getValue = function() {
	return this.codeMirror.getValue();
};

/**
 * Add the given changed listener.
 */
BSONEditor.prototype.addChangeListener = function(changeListener) {
	var _this = this;
	this.changeListener = function() {
		if (!_this.dontFireChangeEevent) {
			changeListener();
		}
	}
};

BSONEditor.prototype.format = function() {
	try {
	  this.dontFireChangeEevent = true;
	  this.setValue(formatter.formatJson(this.getValue(), ' '));
	}
	catch(e) {
		
	}	
	finally {
		this.dontFireChangeEevent = false;
	}
};

BSONEditor.prototype.getBSON = function() {
	var jsonData = this.getValue();
	return BSON.parseStrict(jsonData)
};

BSONEditor.prototype.onAfterUI = function() {
	
	function myJsonValidator(text) {
		if (text == '') {
			return [];
		}
		return CodeMirror.jsonValidator(text);
	}
	;
	
	this.codeMirror = CodeMirror.fromTextArea(this.bsonTextarea, {
		mode : 'application/json',
		lineNumbers : true,
		styleActiveLine: true,
		lineWrapping : true,
		matchBrackets: true,
		autoCloseBrackets: true,
		gutters: ["CodeMirror-linenumbers", "CodeMirror-lint-markers"],
		lintWith: myJsonValidator
	});
	var editor = this.codeMirror;	
	
	var _this= this;
	var onEditorChanged = function() {
		if (_this.changeListener) {
			_this.changeListener();
		}
	};
	
	var waiting;
    editor.on("change", function() {
	  clearTimeout(waiting);
	  waiting = setTimeout(onEditorChanged, 500);
	});
	
};