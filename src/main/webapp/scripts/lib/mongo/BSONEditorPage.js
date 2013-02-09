var BSONEditorPage = (function() {
	return function() {
		this.dirty = false;
		for ( var i = 0; i < arguments.length; i++) {
			switch (i) {
			case 0:
				this.file = arguments[i];
				break;
			default:
				break;
			}
		}
		this.name = this.file.substring(this.file.lastIndexOf('/') + 1, this.file.length);
	};
})();

BSONEditorPage.prototype.getName = function() {
	return this.name;
};

/**
 * Returns true if the editor page is valid and false otherwise.
 * 
 * @returns Boolean
 */
BSONEditorPage.prototype.isValid = function() {
	return this.error == null;
};

/**
 * Returns true if the editor page is dirty and false otherwise.
 * 
 * @returns Boolean
 */
BSONEditorPage.prototype.isDirty = function() {
	return this.dirty == true;
};

/**
 * Set the dirty flag.
 */
BSONEditorPage.prototype.setDirty = function(dirty) {
	var oldDirty = this.dirty;
	this.dirty = dirty;
	if (dirty != oldDirty && this.onDirtyChanged) {
		this.onDirtyChanged(this);
	}
};

/**
 * Set the error.
 * 
 */
BSONEditorPage.prototype.setError = function(error) {
	this.error = error;
	if (this.onErrorChanged) {
		this.onErrorChanged(this);
	}
};
BSONEditorPage.prototype.createUI = function(parent) {

	this.editor = new BSONEditor(parent);

	// load JSON.	
	var _this = this;
	var fileName = this.file;
	fileName= fileName.replace(/\//g, '%2F');
	jQuery.ajax({
		type : 'GET', 
		url : 'jaxrs/resources/load/' + fileName, 
		success : function(data, textStatus, jqXHR) {
			_this.editor.setValue(data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});
	
};

BSONEditorPage.prototype.onAfterUI = function() {
	this.editor.onAfterUI();
};