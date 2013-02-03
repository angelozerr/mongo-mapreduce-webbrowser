var MapReduceExecutorManager = {};
MapReduceExecutorManager.executors = [];
MapReduceExecutorManager.loadedExecutors = [];

MapReduceExecutorManager.createExecutor = function(name, document, mapFunc, reduceFunc, finalizeFunc) {
	return new MapReduceExecutor(name, document, mapFunc, reduceFunc, finalizeFunc);
};

MapReduceExecutorManager.addExecutor = function(namespace) {
	var name = namespace.name;	
	if (name) {				
		var document = namespace.document;
		var mapFunc = namespace.mapFunc;
		var reduceFunc = namespace.reduceFunc;		
		var finalizeFunc = namespace.finalizeFunc;
		var executor = MapReduceExecutorManager.createExecutor(name, document, mapFunc, reduceFunc, finalizeFunc);
		MapReduceExecutorManager.executors.push(executor);
		
		MapReduceExecutorManager.openTab(executor);
	}
};

MapReduceExecutorManager.openInTab = function(name) {
	var executor = MapReduceExecutorManager.loadedExecutors[name];
	if (!executor) {
		executor = MapReduceExecutorManager.createExecutor(name);
		MapReduceExecutorManager.loadedExecutors[name] = executor;
		executor.loadScript();
	}
	else {
		MapReduceExecutorManager.openTab(executor);
	}
}

MapReduceExecutorManager.createTabs = function() {
	var tabs = $("#tabs").tabs();
	// close icon: removing the tab on click
	tabs.delegate("span.ui-icon-close", "click", function() {
		var panelId = $(this).closest("li").remove().attr("aria-controls");
		$("#" + panelId).remove();
		tabs.tabs("refresh");
	});
	return tabs;
};

MapReduceExecutorManager.tabCount = 0;
MapReduceExecutorManager.tabs = null;
MapReduceExecutorManager.openTab = function(executor) {
	var tabs = MapReduceExecutorManager.tabs;
	if (tabs == null) {
		tabs = MapReduceExecutorManager.createTabs();
	}

	var label = executor.name;
	var tabId = "tabs-" + (MapReduceExecutorManager.tabCount++);

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
};