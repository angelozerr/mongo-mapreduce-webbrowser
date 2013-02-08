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
	};
})();

BSONEditorPage.prototype.createUI = function(parent) {

	var editor = new BSONEditor(parent);

	// load JSON.
	var fileName = this.file;
	jQuery.ajax({
		type : 'GET', 
		url : 'jaxrs/resources/load', 
		data : {
			fileName : fileName
		},
		success : function(data, textStatus, jqXHR) {
			editor.setValue(data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});
	
};
