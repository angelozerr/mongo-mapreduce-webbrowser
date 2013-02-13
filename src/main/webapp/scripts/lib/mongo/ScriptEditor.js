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
	//scriptTextarea.setAttribute("rows", "10");
	//scriptTextarea.setAttribute("cols", "150");
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
	var editor = this.codeMirror;
	var hlLine = editor.addLineClass(0, "background", "activeline");
	editor.on("cursorActivity", function() {
	  var cur = editor.getLineHandle(editor.getCursor().line);
	  if (cur != hlLine) {
	    editor.removeLineClass(hlLine, "background", "activeline");
	    hlLine = editor.addLineClass(cur, "background", "activeline");
	  }
	});
	
	var changeListener = this.changeListener;
	var widgets = []
	var validate = function() {
	  editor.operation(function(){
	   /* for (var i = 0; i < widgets.length; ++i)
	      editor.removeLineWidget(widgets[i]);
	    widgets.length = 0;
*/
		  
	    JSHINT("var f=" + editor.getValue() +";");
	    for (var i = 0; i < JSHINT.errors.length; ++i) {
	      var err = JSHINT.errors[i];
	      if (!err) continue;
	      
	      var start = err.character - 1,
			end = start + 1;
	      if (err.evidence) {
			var index = err.evidence.substring(start).search(/.\b/);
			if (index > -1) {
				end += index;
			}
	      }
	      
	      /*var msg = document.createElement("div");
	      var icon = msg.appendChild(document.createElement("span"));
	      icon.innerHTML = "!!";
	      icon.className = "lint-error-icon";
	      msg.appendChild(document.createTextNode(err.reason));
	      msg.className = "lint-error";
	      widgets.push(editor.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}));*/	      
	      var line = err.line-1;	     
	      if(line==0) {
	    	  start = start - 6;
	    	  end = end - 6;
	      }
	      var doc = editor.doc;
	      doc.markText({line: line, ch: start}, {line: line, ch: end}, {
	    	  className: "lint-error",
	    	  readOnly : false
	    	});
	    }
	  });
//	  var info = editor.getScrollInfo();
//	  var after = editor.charCoords({line: editor.getCursor().line + 1, ch: 0}, "local").top;
//	  if (info.top + info.clientHeight < after)
//	    editor.scrollTo(null, after - info.clientHeight + 3);
	}
	
	var onEditorChanged = function() {
		if (changeListener) {
			changeListener();
		}
		//validate();
	};
	
	var waiting;
    editor.on("change", function() {
	  clearTimeout(waiting);
	  waiting = setTimeout(onEditorChanged, 500);
	});

	//setTimeout(validate, 100);
};