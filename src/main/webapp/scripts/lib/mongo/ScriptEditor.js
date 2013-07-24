var EDITOR_TYPE = {
    "Map" : 0,
    "Reduce" : 1,
    "Finalize" : 2
};

(function() {
    "use strict";

    function createUI(parent) {

	var containerDiv = document.createElement('div');
	containerDiv.className = "bson-editor-container";

	var scriptTextarea = document.createElement('textarea');
	containerDiv.appendChild(scriptTextarea);
	parent.appendChild(containerDiv);

	return scriptTextarea;
    }

    MMRWB.ScriptEditor = function(parent, executor, type) {
	this.scriptTextarea = createUI(parent);
	this.executor = executor;
	this.type = type;
    }

    MMRWB.ScriptEditor.prototype = {
	setValue : function(value) {
	    if (this.codeMirror) {
		this.codeMirror.setValue(value)
	    } else {
		this.scriptTextarea.value = value;
	    }
	},

	getValue : function() {
	    return this.codeMirror.getValue();
	},

	addChangeListener : function(changeListener) {
	    this.changeListener = changeListener;
	},

	onAfterUI : function() {

	    // Validation

	    function myJavascriptValidator(text) {
		if (text == '') {
		    return [];
		}
		return CodeMirror.javascriptValidator('var f=' + text + ';');
	    }

	    function myFormatAnnotation(ann) {
		if (ann.from.line == 0) {
		    var length = 'var f='.length;
		    ann.from.ch = ann.from.ch - length;
		    ann.to.ch = ann.to.ch - length;
		}
		return ann;
	    }

	    // Completion

	    function toJSONMeta(jsonObj) {
		var meta = '{';
		var i = 0;
		for ( var k in jsonObj) {
		    if (i > 0)
			meta += ',';
		    meta += '"';
		    meta += k;
		    meta += '":';
		    var v = jsonObj[k];
		    switch (typeof v) {
		    case "string":
			meta += '""';
			break;
		    case "number":
			meta += '0';
			break;
		    case "boolean":
			meta += 'true';
			break;
		    case "object":
			if (v instanceof Date) {
			    meta += 'new Date()';
			} else if (v instanceof ObjectId) {
			    meta += '{"timestamp": new Date(), "machine":0, "pid": 0, "increment": 0}';
			} else if (Object.prototype.toString.apply(v) === '[object Array]') {
			    meta += '[';
			    var length = v.length;
			    for ( var j = 0; j < length; j++) {
				meta += toJSONMeta(v[j]);
			    }
			    meta += ']';
			}
			break;
		    default:
			meta += 'null';
		    }
		    i++;
		}
		meta += '}';
		return meta;
	    }

	    var _this = this;

	    function getText(cm) {
		if (_this.type == EDITOR_TYPE.Map) {
		    var jsonObj = _this.executor.bsonEditor
			    .getFirstBSONObject();
		    var json = toJSONMeta(jsonObj);
		    return cm.getValue() + ".apply(" + json + ")";
		} else if (_this.type == EDITOR_TYPE.Reduce) {
		    var key = {};
		    var values = [];
		    var data = _this.executor.getMapData();
		    if (data) {
			key = data.key;
			values = data.values.slice(0, data.count)
		    }
		    return cm.getValue() + ".call(this," + JSON.stringify(key)
			    + "," + JSON.stringify(values) + ")";
		}
		return cm.getValue();
	    }

	    function passAndHint(cm) {
		setTimeout(function() {
		    cm.execCommand("autocomplete");
		}, 100);
		return CodeMirror.Pass;
	    }

	    function myHint(cm) {
		// FIXME : should be improved!
		var server = CodeMirror.tern.getServer(cm);
		server.delDoc('[doc]');
		return CodeMirror.showHint(cm, CodeMirror.ternHint, {
		    async : true
		});
	    }

	    CodeMirror.commands.autocomplete = function(cm) {
		CodeMirror.showHint(cm, myHint);
	    }
	    this.codeMirror = CodeMirror.fromTextArea(this.scriptTextarea,
		    {
			mode : 'javascript',
			lineNumbers : true,
			styleActiveLine : true,
			lineWrapping : true,
			matchBrackets : true,
			autoCloseBrackets : true,
			showCursorWhenSelecting : true,
			gutters : [ "CodeMirror-lint-markers",
				"CodeMirror-linenumbers" ],
			lintWith : {
			    "getAnnotations" : myJavascriptValidator,
			    "formatAnnotation" : myFormatAnnotation
			},
			extraKeys : {
			    "'.'" : passAndHint,
			    "Ctrl-Space" : "autocomplete",
			    "Ctrl-I": function(cm) { CodeMirror.tern.showType(cm); },
		  	    "F3": function(cm) { CodeMirror.tern.jumpToDef(cm); },
			    "Alt-,": function(cm) { CodeMirror.tern.jumpBack(cm); },
			    "F2": function(cm) { CodeMirror.tern.rename(cm); },
			    "F11" : function(cm) {
				setFullScreen(cm, !isFullScreen(cm));
			    },
			    "Esc" : function(cm) {
				if (isFullScreen(cm))
				    setFullScreen(cm, false);
			    }
			},
			ternWith : {
			    "getText" : getText
			}
		    });
	    var editor = this.codeMirror;

	    var changeListener = this.changeListener;
	    var onEditorChanged = function() {
		if (changeListener) {
		    changeListener();
		}
	    };

	    var waiting;
	    editor.on("change", function() {
		clearTimeout(waiting);
		waiting = setTimeout(onEditorChanged, 500);
	    });

	}
    }

})();