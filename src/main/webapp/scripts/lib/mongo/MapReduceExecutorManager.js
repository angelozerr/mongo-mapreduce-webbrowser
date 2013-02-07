var MapReduceExecutorManager = {};
MapReduceExecutorManager.loadedExecutors = [];
MapReduceExecutorManager.executors = [];

MapReduceExecutorManager.createExecutor = function(file, namespaceName, name, document, mapFunc, reduceFunc, finalizeFunc) {
	return new MapReduceExecutor(file, namespaceName, name, document, mapFunc, reduceFunc, finalizeFunc);
};

MapReduceExecutorManager.addExecutor = function(namespace) {
	var file = namespace.file;	
	if (file) {
		
		var executor = MapReduceExecutorManager.loadedExecutors[file];
		if (!executor) {
			executor = MapReduceExecutorManager.createExecutor(file);	
			MapReduceExecutorManager.loadedExecutors[file] = executor;
			MapReduceExecutorManager.executors.push(executor);
		}
		executor.namespaceName = namespace.namespaceName;
		executor.name = namespace.name;
		executor.document = namespace.document;
		executor.mapFunc = namespace.mapFunc;
		executor.reduceFunc = namespace.reduceFunc;		
		executor.finalizeFunc = namespace.finalizeFunc;
		executor.dirty = false;
		
		MapReduceExecutorManager.openEditor(executor);
	}
};

MapReduceExecutorManager.openInTab = function(file) {
	var executor = MapReduceExecutorManager.loadedExecutors[file];
	if (!executor) {
		executor = MapReduceExecutorManager.createExecutor(file);
		MapReduceExecutorManager.loadedExecutors[file] = executor;
		MapReduceExecutorManager.executors.push(executor);
		executor.loadScript();
	}
	else {
		MapReduceExecutorManager.openEditor(executor);
	}
}

MapReduceExecutorManager.createTabs = function() {
	var tabs = $("#tabs").tabs();
	// close icon: removing the tab on click
	tabs.delegate("span.ui-icon-close", "click", function() {
		var panelId = $(this).closest("li").remove().attr("aria-controls");
		$("#" + panelId).remove();
		tabs.tabs("refresh");
		
		var executors = MapReduceExecutorManager.executors;
		for ( var i = 0; i < executors.length; i++) {
			var executor = executors[i];
			if (executor.tabId === panelId) {
				executor.tabId = null;
			}
		}
	});
	return tabs;
};

MapReduceExecutorManager.openEditor = function(executor) {
	var tabId = executor.tabId;
	if (tabId) {
		var index = MapReduceExecutorManager.getTabIndex(tabId);
		MapReduceExecutorManager.tabs.tabs("option", "active", index);
	}
	else {
		MapReduceExecutorManager.openTab(executor);
	}
};

MapReduceExecutorManager.tabCount = 0;
MapReduceExecutorManager.tabs = null;
MapReduceExecutorManager.getTabIndex = function(tabId) {
	var ulTabs = MapReduceExecutorManager.tabs.find(".ui-tabs-nav");
	var children = ulTabs.children();
	for ( var i = 0; i < children.length; i++) {
		if ( $( children[i] ).attr( "aria-controls" ) === tabId ) {
			return i;			
		}
	}
	return -1;
};

MapReduceExecutorManager.openTab = function(executor) {
	var tabs = MapReduceExecutorManager.tabs;
	if (tabs == null) {
		tabs = MapReduceExecutorManager.createTabs();
		MapReduceExecutorManager.tabs = tabs;
	}

	var label = executor.name;
	var tabId = "tabs-" + (MapReduceExecutorManager.tabCount++);
	var tabIdLink = "a-" + tabId; 
	
	var li = "<li><a href='#"
			+ tabId
			+ "' class='status-ok' >&nbsp;"
			+ label
			+ "</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>"
	var ulTabs = tabs.find(".ui-tabs-nav");
	ulTabs.append(li);

	var tabContent = document.createElement('div');
	tabContent.id = tabId;

	executor.loadUI(tabContent, tabIdLink);

	tabs.append(tabContent);
	tabs.tabs("refresh");
	
	var index = MapReduceExecutorManager.getTabIndex(tabId);
	tabs.tabs("option", "active", index);
	
	executor.tabId = tabId;
	
	var tabIdLink = $("#" + tabId ).attr("aria-labelledby");
	executor.tabLink = document.getElementById(tabIdLink);
	
	executor.execute();
	
};