$(function() {

	/* Resizable navigator */
	var nav = $('#navigator-wrapper');
	nav.resizable({
		handles : "e"
	});
	
	var openNewMapreduceDialog = function(path) {
		if (!path) {
			path = '/mapreduces';
		}
		$('#mapreduce_path').val(path);
		$('#mapreduce_name').val('MyMapReduce.js');
		$("#dialog_new_mapreduce").dialog("open");
	};

	// Button click on New MapReduce open the dialog
	document.getElementById("new_mapreduce").onclick = function() {
		openNewMapreduceDialog();
	};

	var select = document.getElementById('mapreduce_template');

	// Create Map Reduce executor and link it to a new tab
	var createMapReduce = function(file, namespaceName, name) {
		var document = [];
		var mapFunc = 'function () {\n}'
		var reduceFunc = 'function (key, values) {\n}'
		var executor = MultiPageEditor.createExecutor(file, namespaceName, name, document,
				mapFunc, reduceFunc);
		MultiPageEditor.openTab(executor);
		executor.setDirty(true);
	};

	var selectedPath
	// Dialog New MapReduce
	$("#dialog_new_mapreduce").dialog({
		autoOpen : false,
		height : 300,
		width : 350,
		modal : true,
		buttons : {
			"OK" : function() {
				var bValid = true;
				if (bValid) {
					var name = $('#mapreduce_name').val();
					var file = $('#mapreduce_path').val() + '/' + name;
					var namespaceName = file.replace(/\//g ,'_').replace(/./g ,'_');
					createMapReduce(file, namespaceName, name);
					$(this).dialog("close");
				}
			},
			Cancel : function() {
				$(this).dialog("close");
			}
		},
		close : function() {
			// allFields.val( "" ).removeClass( "ui-state-error" );
		}
	});

	// --- Contextmenu helper --------------------------------------------------
	var bindContextMenu = function(span) {
		// Add context menu to this node:
		$(span).contextMenu({
			menu : "myMenu"
		}, function(action, el, pos) {
			// The event was bound to the <span> tag, but the node object
			// is stored in the parent <li> tag
			var node = $.ui.dynatree.getNode(el);
			switch (action) {
			case "new":
				var path = node.getKeyPath(node.data.isFolder);
				openNewMapreduceDialog(path);
				break;
			case "open":
				var path = node.getKeyPath(false);
				MultiPageEditor.openInTab(path);
				break;
			case "paste":
				// copyPaste(action, node);
				break;
			default:
				alert("Todo: appply action '" + action + "' to node " + node);
			}
		});
	};

	$("#navigator-container").dynatree({
		title : "Lazy loading sample",
		fx : {
			height : "toggle",
			duration : 200
		},
		autoFocus : false, // Set focus to first child, when expanding or
		// lazy-loading.
		initAjax : {
			url : "jaxrs/resources/list/"
		},

		onActivate : function(node) {
			// $("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
		},

		onClick : function(node, event) {
			// Close menu on click
			if ($(".contextMenu:visible").length > 0) {
				$(".contextMenu").hide();
				// return false;
			}
		},

		onLazyRead : function(node) {
			node.appendAjax({
				url : "jaxrs/resources/mapreduces/",
				// We don't want the next line in production code:
				debugLazyDelay : 750
			});
		},

		onDblClick : function(node, event) {
			var path = node.getKeyPath(false);
			MultiPageEditor.openInTab(path);
		},

		onCreate : function(node, span) {
			bindContextMenu(span);
		}
	});

});