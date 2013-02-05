$(function() {

	/* Resizable navigator */
	var nav = $('#navigator-wrapper');
	nav.resizable({
		handles : "e"
	});

	// Button click on New MapReduce open the dialog
	document.getElementById("new_mapreduce").onclick = function() {
		$("#dialog_new_mapreduce").dialog("open");
	};

	// $( "#new_mapreduce" )
	// .button()
	// .click(function() {
	// $( "#dialog_new_mapreduce" ).dialog( "open" );
	// });

	var select = document.getElementById('mapreduce_template');

	// Create Map Reduce executor and link it to a new tab
	var createMapReduce = function(name) {
		var document = [];
		var mapFunc = 'function () {\n}'
		var reduceFunc = 'function (key, values) {\n}'
		var executor = MapReduceExecutorManager.createExecutor(name, document,
				mapFunc, reduceFunc);
		MapReduceExecutorManager.openTab(executor);
	};

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
					createMapReduce($('#mapreduce_name').val());
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
				$("#dialog_new_mapreduce").dialog("open");
				break;
			case "open":
				var path = node.getKeyPath(false);
				MapReduceExecutorManager.openInTab(path);
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
			url : "jaxrs/resources/mapreduces/"
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
			MapReduceExecutorManager.openInTab(path);
		},

		onCreate : function(node, span) {
			bindContextMenu(span);
		}
	});

});