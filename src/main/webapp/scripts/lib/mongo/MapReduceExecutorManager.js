var MapReduceExecutorManager = {};
MapReduceExecutorManager.executors = [];

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
	}
};