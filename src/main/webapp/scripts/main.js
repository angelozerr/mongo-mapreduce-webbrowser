var SERVICE_LIST_BASE_URL = 'services/resources/list/'; 
var SERVICE_LOAD_BASE_URL = 'services/resources/load/';
var SERVICE_SAVE_BASE_URL = 'services/resources/save/';

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
		var executor = MultiPageEditor.createMapReduceEditorPage(file, namespaceName, name, document,
				mapFunc, reduceFunc);
		executor.setDirty(true);
		MultiPageEditor.openTab(executor);
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
					var namespaceName = file.replace(/\//g ,'_').replace("." ,'_');
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

	var baseURL = window.location.origin + window.location.pathname;
	var tree = $("#navigator-container").dynatree({
		title : "Mongo tree",
		fx : {
			height : "toggle",
			duration : 200
		},
		autoFocus : false, // Set focus to first child, when expanding or
		// lazy-loading.
		initAjax : {
			url : SERVICE_LIST_BASE_URL
		},

		onActivate : function(node) {
			document.getElementById('resource_link').innerHTML = '';
			if (!node.data.isFolder) {
				var url = baseURL + '?p=' + node.getKeyPath();
				var htmlLink = '<a href=\"' + url + '">' + url  + '</a>';
				document.getElementById('resource_link').innerHTML = htmlLink;	
			}
		},

		onClick : function(node, event) {
			// Close menu on click
			if ($(".contextMenu:visible").length > 0) {
				$(".contextMenu").hide();
				// return false;
			}
		},

		onDblClick : function(node, event) {
			var path = node.getKeyPath(false);
			MultiPageEditor.openInTab(path);
		},

		onCreate : function(node, span) {
			bindContextMenu(span);
		},
		
		debugLevel : 0
	});
	MultiPageEditor.tree = tree;
	
	// Check if there are resource parameter in the URL to open for each resource the tab.
	var queryString = window.location.search;
	if (queryString.startsWith('?')) {
		queryString = '&' + queryString.substring(1, queryString.length);
		var params = queryString.split('&p=');
		for ( var i = 0; i < params.length; i++) {
			var path = params[i];
			if (path != '') {
				try {
					MultiPageEditor.openInTab(path);
				}
				catch(e) {
					// Ignore error.
				}
			}
		}
	}		
});