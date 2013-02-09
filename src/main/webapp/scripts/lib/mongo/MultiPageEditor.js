/**
 * Multi page editor.
 */
var MultiPageEditor = {};
MultiPageEditor.pagesCachedByPath = [];
MultiPageEditor.pages = [];
MultiPageEditor.tabCount = 0;
MultiPageEditor.tabs = null;

// ------------- BSON Editor Page

/**
 * Create BSON Editor Page.
 */
MultiPageEditor.createBSONEditorPage = function(path) {
	var page = page = new BSONEditorPage(path);
	MultiPageEditor.pagesCachedByPath[path] = page;
	MultiPageEditor.pages.push(page);
	return page;
};


MultiPageEditor.createMapReduceEditorPage = function(file, namespaceName, name, document, mapFunc, reduceFunc, finalizeFunc) {
	var page = new MapReduceEditorPage(file, namespaceName, name, document, mapFunc, reduceFunc, finalizeFunc);
	MultiPageEditor.pagesCachedByPath[file] = page;
	MultiPageEditor.pages.push(page);
	return page;
};

MultiPageEditor.createMapReduce = function(file, namespaceName, name) {
	var document = [];
	var mapFunc = 'function () {\n}'
	var reduceFunc = 'function (key, values) {\n}'
	var executor = MultiPageEditor.createMapReduceEditorPage(file, namespaceName, name, document,
			mapFunc, reduceFunc);
	executor.setDirty(true);
	MultiPageEditor.openTab(executor);
};

MultiPageEditor.addExecutor = function(namespace) {
	var file = namespace.file;	
	if (file) {		
		var executor = MultiPageEditor.pagesCachedByPath[file];
		if (!executor) {
			executor = MultiPageEditor.createMapReduceEditorPage(file);				
		}
		executor.namespaceName = namespace.namespaceName;
		executor.name = namespace.name;
		executor.document = namespace.document;
		executor.mapFunc = namespace.mapFunc;
		executor.reduceFunc = namespace.reduceFunc;		
		executor.finalizeFunc = namespace.finalizeFunc;
		executor.setDirty(false);
		
		// Open the page in a tab
		MultiPageEditor.openOrSelectTab(executor);
		
		// Check if the page is in a tree, otherwise reload the tree
		var dynatree = MultiPageEditor.tree.dynatree("getTree");
		var treePath = executor.file;
		dynatree.loadKeyPath(treePath, function(node, status){
		    if(status == "loaded") {
		        // 'node' is a parent that was just traversed.
		        // If we call expand() here, then all nodes will be expanded
		        // as we go
		        node.expand();
		    }else if(status == "ok") {
		        // 'node' is the end node of our path.
		        // If we call activate() or makeVisible() here, then the
		        // whole branch will be exoanded now
		        node.activate();
		    }else if(status == "notfound") {
		    	dynatree.reload();		    	
		    }
		});		
	}
};

MultiPageEditor.openInTab = function(path) {
	var page = MultiPageEditor.pagesCachedByPath[path];
	if (!page) {
		// open the well editor swith the extension file.
		if (path.endsWith('.json')) {
			// BSON Editor page
			page = new MultiPageEditor.createBSONEditorPage(path);
			MultiPageEditor.openOrSelectTab(page);
		}
		else {
			// MapReduce editor page
			page = MultiPageEditor.createMapReduceEditorPage(path);
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
		page.tabLink.innerHTML = MultiPageEditor.getTabHeaderLabel(page);				
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
	
	// Create tabs if needed.
	var tabs = MultiPageEditor.tabs;
	if (tabs == null) {
		tabs = MultiPageEditor.createTabs();
		MultiPageEditor.tabs = tabs;
	}

	// Create tab header
	var label = MultiPageEditor.getTabHeaderLabel(page);
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
	
	page.onAfterUI();
	
};

MultiPageEditor.getTabHeaderLabel = function(page) {
	if (page.isDirty()) {
		return page.getName() + ' *';
	} 
	return page.getName();
};