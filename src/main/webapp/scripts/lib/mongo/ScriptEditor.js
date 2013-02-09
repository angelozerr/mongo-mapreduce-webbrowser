/**
 * Creates a new ScriptEditor.
 * 
 * @param parent
 *            HTML element parent where the editor should be added.
 * @constructor
 */
function ScriptEditor(parent) {
	this.scriptTextarea = this._createUI(parent);
};

/**
 * Create the UI.
 */
ScriptEditor.prototype._createUI = function(parent) {

	var containerDiv = document.createElement('div');
	containerDiv.className = "bson-editor-container";

	var scriptTextarea = document.createElement('textarea');
	scriptTextarea.setAttribute("rows", "10");
	scriptTextarea.setAttribute("cols", "150");
	containerDiv.appendChild(scriptTextarea);
	parent.appendChild(containerDiv);
	
	return scriptTextarea;
};

/**
 * Set value of the editor.
 * 
 * @param value
 *            the value to set.
 */
ScriptEditor.prototype.setValue = function(value) {
	if (this.codeMirror) {
		this.codeMirror.setValue(value)
	} else {
		this.scriptTextarea.value = value;
	}
};

/**
 * Returns the value of the editor.
 * 
 * @returns the value of the editor.
 */
ScriptEditor.prototype.getValue = function() {
	return this.codeMirror.getValue();
};

/**
 * Add the given changed listener.
 */
ScriptEditor.prototype.addChangeListener = function(changeListener) {
	this.changeListener = changeListener;
};

ScriptEditor.prototype.onAfterUI = function() {
	this.codeMirror = CodeMirror.fromTextArea(this.scriptTextarea, {
		mode : 'application/javascript',
		lineNumbers : true,
		lineWrapping : true
	});
	if (this.changeListener) {
		CodeMirror.on(this.codeMirror, "change", this.changeListener);
	}
};