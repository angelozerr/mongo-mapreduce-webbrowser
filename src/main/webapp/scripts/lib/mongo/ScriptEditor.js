/**
 * Creates a new ScriptEditor.
 * 
 * @param parent
 *          HTML element parent where the editor should be added.
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
  // scriptTextarea.setAttribute("rows", "10");
  // scriptTextarea.setAttribute("cols", "150");
  containerDiv.appendChild(scriptTextarea);
  parent.appendChild(containerDiv);

  return scriptTextarea;
};

/**
 * Set value of the editor.
 * 
 * @param value
 *          the value to set.
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

  function myJavascriptValidator(text) {
    if (text == '') {
      return [];
    }
    return CodeMirror.javascriptValidator('var f=' + text + ';');
  }
  ;

  function myFormatAnnotation(ann) {
    if (ann.from.line == 0) {
      var length = 'var f='.length;
      ann.from.ch = ann.from.ch - length;
      ann.to.ch = ann.to.ch - length;
    }
    return ann;
  }

  function passAndHint(cm) {
    setTimeout(function() {
      cm.execCommand("autocomplete");
    }, 100);
    return CodeMirror.Pass;
  }

  function myHint(cm) {
    return CodeMirror.showHint(cm, CodeMirror.ternHints, {
      async : true
    });
  }

  CodeMirror.commands.autocomplete = function(cm) {
    CodeMirror.showHint(cm, myHint);
  }
  this.codeMirror = CodeMirror.fromTextArea(this.scriptTextarea, {
    mode : 'javascript',
    lineNumbers : true,
    styleActiveLine : true,
    lineWrapping : true,
    matchBrackets : true,
    autoCloseBrackets : true,
    gutters : [ "CodeMirror-lint-markers", "CodeMirror-linenumbers" ],
    lintWith : {
      "getAnnotations" : myJavascriptValidator,
      "formatAnnotation" : myFormatAnnotation
    },
    extraKeys : {
      "'.'" : passAndHint,
      "Ctrl-Space" : "autocomplete"
    },
    ternWith : true
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

};