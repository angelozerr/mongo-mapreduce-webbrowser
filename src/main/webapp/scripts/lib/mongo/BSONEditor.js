var MMRWB = {};

(function() {
  "use strict";

  function createUI(parent, titleLabel, /* Boolean */editable) {

    var toolbarDiv = document.createElement('div');
    // title
    var title = document.createElement('span');
    title.className = "title-editor";
    title.appendChild(document.createTextNode(titleLabel));
    toolbarDiv.appendChild(title);

    // Format button
    var formatButton = document.createElement('input');
    formatButton.type = 'button';
    formatButton.value = 'Format';    
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
    containerDiv.appendChild(bsonTextarea);
    parent.appendChild(containerDiv);

    return {'textarea': bsonTextarea, 'formatButton' : formatButton}; 
  }

  MMRWB.BSONEditor = function(parent, titleLabel, editable) {
    this.editable = editable;
    var result = createUI(parent, titleLabel, editable);
    this.bsonTextarea = result.textarea;
    var formatButton = result.formatButton;
    var self = this;
    formatButton.onclick = function() {
      self.format();
    };
  }

  MMRWB.BSONEditor.prototype = {

    setValue : function(value) {
      if (this.codeMirror) {
        this.codeMirror.setValue(value)
      } else {
        this.bsonTextarea.value = value;
      }
    },

    getValue : function() {
      return this.codeMirror.getValue();
    },

    addChangeListener : function(changeListener) {
      var _this = this;
      this.changeListener = function() {
        if (!_this.dontFireChangeEevent) {
          changeListener();
        }
      }
    },

    format : function() {
      try {
        this.dontFireChangeEevent = true;
        this.setValue(formatter.formatJson(this.getValue(), ' '));
      } catch (e) {

      } finally {
        this.dontFireChangeEevent = false;
      }
    },

    getBSON : function() {
      var jsonData = this.getValue();
      var array = BSON.parseStrict(jsonData);
      if (array.length) {
        this.bsonObject = array[0];
      }
      return array;
    },

    onAfterUI : function() {

      function myJsonValidator(text) {
        if (text == '') {
          return [];
        }
        return CodeMirror.jsonValidator(text);
      }

      this.codeMirror = CodeMirror.fromTextArea(this.bsonTextarea, {
        mode : 'application/json',
        lineNumbers : true,
        styleActiveLine : true,
        lineWrapping : true,
        matchBrackets : true,
        autoCloseBrackets : true,
        showCursorWhenSelecting : true,
        gutters : [ "CodeMirror-lint-markers", "CodeMirror-linenumbers" ],
	extraKeys : {
	    "F11" : function(cm) {
		setFullScreen(cm, !isFullScreen(cm));
	    },
	    "Esc" : function(cm) {
		if (isFullScreen(cm))
		    setFullScreen(cm, false);
	    }
	},
        lintWith : myJsonValidator
      })
      var editor = this.codeMirror;

      var _this = this;
      var onEditorChanged = function() {
        if (_this.changeListener) {
          _this.changeListener();
        }
      };

      var waiting;
      editor.on("change", function() {
        _this.bsonObject = null;
        clearTimeout(waiting);
        waiting = setTimeout(onEditorChanged, 500);
      });

    },

    getFirstBSONObject : function() {
      if (this.bsonObject == null) {
        this.getBSON();
      }
      return this.bsonObject;
    }
  }

})();
