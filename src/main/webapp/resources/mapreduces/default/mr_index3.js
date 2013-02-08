
${namespace}.mapFunc=function () {
	for ( var i=0; i<this.tags.length; i++ )
        emit( this.tags[i] , 1 )
}
${namespace}.reduceFunc=function ( key , values ){ 
    return Array.sum( values );
}
${namespace}.document=[{"_id":1,"name":"name1","tags":["dog","cat"]},{"_id":2,"name":"name2","tags":["cat"]},{"_id":3,"name":"name3","tags":["mouse","cat","dog"]},{"_id":4,"name":"name4","tags":[]}]