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

	var createTabs = function() {
		var tabs = $("#tabs").tabs();
		// close icon: removing the tab on click
		tabs.delegate("span.ui-icon-close", "click", function() {
			var panelId = $(this).closest("li").remove().attr("aria-controls");
			$("#" + panelId).remove();
			tabs.tabs("refresh");
		});
		return tabs;
	};

	var tabCount = 0;
	var tabs = null;
	var openTab = function(executor) {
		if (tabs == null) {
			tabs = createTabs();
		}

		var label = executor.name;
		var tabId = "tabs-" + (tabCount++);

		var li = "<li><a href='#"
				+ tabId
				+ "'>"
				+ label
				+ "</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>"
		tabs.find(".ui-tabs-nav").append(li);

		var tabContent = document.createElement('div');
		tabContent.id = tabId;

		executor.loadUI(tabContent);

		tabs.append(tabContent);
		tabs.tabs("refresh");

		var index = $('#tabs ul').index($('#' + tabId));
		tabs.tabs("option", "active", index);
		
		executor.execute();
	}

	var select = document.getElementById('mapreduce_template');

	// Create Map Reduce executor and link it to a new tab
	var createMapReduce = function(name) {
		var executor = MapReduceExecutorManager.createExecutor(name);
		if (select.selectedIndex > 0) {
			var templateExecutor = MapReduceExecutorManager.executors[select.selectedIndex - 1];
			executor = MapReduceExecutorManager.createExecutor(name,
					templateExecutor.document, templateExecutor.mapFunc,
					templateExecutor.reduceFunc, templateExecutor.finalizeFunc);
		} else {
			executor = MapReduceExecutorManager.createExecutor(name);
		}
		openTab(executor);
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

	// Populate combo template
	var executors = MapReduceExecutorManager.executors
	for ( var i = 0; i < executors.length; i++) {
		var name = executors[i].name;
		var option = document.createElement('option');
		option.value = name;
		option.appendChild(document.createTextNode(name));
		select.appendChild(option);
	}
	
	$("#navigator-container").dynatree({
		title: "Lazy loading sample",
		fx: { height: "toggle", duration: 200 },
		autoFocus: false, // Set focus to first child, when expanding or lazy-loading.
		initAjax: {
			url: "jaxrs/resources/mapreduces/"
			},

		onActivate: function(node) {
			//$("#echoActive").text("" + node + " (" + node.getKeyPath()+ ")");
		},

		onLazyRead: function(node){
			node.appendAjax({
				url: "jaxrs/resources/mapreduces/",
				// We don't want the next line in production code:
				debugLazyDelay: 750
			});
		}
	});

});