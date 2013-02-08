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

	var bsonTextarea = document.createElement('textarea');
	bsonTextarea.setAttribute("rows", "10");
	bsonTextarea.setAttribute("cols", "150");
	parent.appendChild(bsonTextarea);
	return bsonTextarea;
};

/**
 * Set value of the editor.
 * 
 * @param value
 *            the value to set.
 */
BSONEditor.prototype.setValue = function(bsonData) {
	this.bsonTextarea.value = bsonData;
};

/**
 * Returns the value of the editor.
 * 
 * @returns the value of the editor.
 */
BSONEditor.prototype.getValue = function() {
	return this.bsonTextarea.value;
};

/**
 * Add the given changed listener.
 */
BSONEditor.prototype.addChangeListener = function(changeListener) {
	this.bsonTextarea.onkeyup = changeListener;
	this.bsonTextarea.onchange = changeListener;
};