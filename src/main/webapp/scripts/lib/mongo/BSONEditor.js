/**
 * Creates a new BSONEditor.
 * 
 * @param parent
 *            HTML element parent where the editor should be added.
 * @constructor
 */
function BSONEditor(parent) {
	this.bsonTextarea = this._createUI(parent);
};

/**
 * Create the UI.
 */
BSONEditor.prototype._createUI = function(parent) {

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
	this.changeListener = changeListener;
};

BSONEditor.prototype.onAfterUI = function() {
	this.codeMirror = CodeMirror.fromTextArea(this.bsonTextarea, {
		mode : 'application/json',
		lineNumbers : true,
		lineWrapping : true
	});
	var editor = this.codeMirror;
	var hlLine = editor.addLineClass(0, "background", "activeline");
	editor.on("cursorActivity", function() {
	  var cur = editor.getLineHandle(editor.getCursor().line);
	  if (cur != hlLine) {
	    editor.removeLineClass(hlLine, "background", "activeline");
	    hlLine = editor.addLineClass(cur, "background", "activeline");
	  }
	});
	if (this.changeListener) {
		CodeMirror.on(this.codeMirror, "change", this.changeListener);
	}
};