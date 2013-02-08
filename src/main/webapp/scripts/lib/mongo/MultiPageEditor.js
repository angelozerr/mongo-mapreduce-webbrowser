/**
 * Multi page editor.
 */
var MultiPageEditor = {};
MultiPageEditor.pagesCachedByPath = [];
MultiPageEditor.pages = [];
MultiPageEditor.tabCount = 0;
MultiPageEditor.tabs = null;

MultiPageEditor.createExecutor = function(file, namespaceName, name, document, mapFunc, reduceFunc, finalizeFunc) {
	return new MapReduceExecutor(file, namespaceName, name, document, mapFunc, reduceFunc, finalizeFunc);
};

MultiPageEditor.addExecutor = function(namespace) {
	var file = namespace.file;	
	if (file) {		
		var executor = MultiPageEditor.pagesCachedByPath[file];
		if (!executor) {
			executor = MultiPageEditor.createExecutor(file);	
			MultiPageEditor.pagesCachedByPath[file] = executor;
			MultiPageEditor.pages.push(executor);
		}
		executor.namespaceName = namespace.namespaceName;
		executor.name = namespace.name;
		executor.document = namespace.document;
		executor.mapFunc = namespace.mapFunc;
		executor.reduceFunc = namespace.reduceFunc;		
		executor.finalizeFunc = namespace.finalizeFunc;
		executor.setDirty(false);
		
		MultiPageEditor.openOrSelectTab(executor);
	}
};

MultiPageEditor.openInTab = function(path) {
	var page = MultiPageEditor.pagesCachedByPath[path];
	if (!page) {
		// open the well editor swith the extension file.
		if (path.endsWith('.json')) {
			// BSON Editor
			page = new BSONEditorPage(path);
			MultiPageEditor.pagesCachedByPath[path] = page;
			MultiPageEditor.pages.push(page);
			MultiPageEditor.openOrSelectTab(page);
		}
		else {
			// MapReduce editor
			page = MultiPageEditor.createExecutor(path);
			MultiPageEditor.pagesCachedByPath[path] = page;
			MultiPageEditor.pages.push(page);
			page.loadScript();	
		}
	}
	else {
		// page content is already loaded, open it in a new tab. 
		MultiPageEditor.openOrSelectTab(page);
	}
}

MultiPageEditor.createTabs = function() {
	var tabs = $("#tabs").tabs();
	// close icon: removing the tab on click
	
	tabs.delegate("span.ui-icon-close", "click", function() {
		var panelId = $(this).closest("li").remove().attr("aria-controls");
		$("#" + panelId).remove();
		tabs.tabs("refresh");
		
		var page = MultiPageEditor.getPage(panelId);
		if (page != null) {			
			page.tabId = null;
		}
	});
	return tabs;
};

MultiPageEditor.openOrSelectTab = function(page) {
		
	var tabId = page.tabId;
	if (tabId) {
		// select tab
		var index = MultiPageEditor.getTabIndex(tabId);
		MultiPageEditor.tabs.tabs("option", "active", index);
	}
	else {
		// open tab.
		MultiPageEditor.openTab(page);
	}
};

MultiPageEditor.getTabIndex = function(tabId) {
	var ulTabs = MultiPageEditor.tabs.find(".ui-tabs-nav");
	var children = ulTabs.children();
	for ( var i = 0; i < children.length; i++) {
		if ( $( children[i] ).attr( "aria-controls" ) === tabId ) {
			return i;			
		}
	}
	return -1;
};

MultiPageEditor.getPage = function(tabLinkId) {
	var pages = MultiPageEditor.pages;
	for ( var i = 0; i < pages.length; i++) {
		var page = pages[i];
		if (page.tabId === tabLinkId) {
			return page;
		}
	}
	return null;
};

MultiPageEditor.openTab = function(page) {
	
	// Add dirty listener
	page.onDirtyChanged = function(page) {
		var label = page.tabLink.innerHTML;
		if (label.endsWith(' *')) {
			label = label.substring(0, label.length - 2);
		}
		if (page.isDirty()) {
			page.tabLink.innerHTML = label + ' *'
		} else {
			page.tabLink.innerHTML = label;
		}		
	};
	
	// Add error listener
	page.onErrorChanged = function(page) {
		var className = page.tabLink.className;		
		className = className.replace('status-ok', '');
		className = className.replace('status-nok', '');
		if (page.error == null) {
			page.tabLink.className = 'status-ok' + className;
		}
		else {
			page.tabLink.className = 'status-nok' + className;
		}
	};
	
	var tabs = MultiPageEditor.tabs;
	if (tabs == null) {
		tabs = MultiPageEditor.createTabs();
		MultiPageEditor.tabs = tabs;
	}

	var label = page.name;
	var tabId = "tabs-" + (MultiPageEditor.tabCount++);
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

	page.createUI(tabContent, tabIdLink);

	tabs.append(tabContent);
	tabs.tabs("refresh");
	
	var index = MultiPageEditor.getTabIndex(tabId);
	tabs.tabs("option", "active", index);
	
	page.tabId = tabId;
	
	var tabIdLink = $("#" + tabId ).attr("aria-labelledby");
	page.tabLink = document.getElementById(tabIdLink);
	
	page.execute();
	
};