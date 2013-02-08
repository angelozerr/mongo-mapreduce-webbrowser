
${namespace}.mapFunc=function () {
	for ( i=0; i<this.tags.length; i++ )
        emit( this.tags[i] , 1 );
}
${namespace}.reduceFunc=function (k , vs) {
	return Array.sum( vs );
}
${namespace}.document=[{"tags":[1]},{"tags":[1,2]},{"tags":[1,2,3]},{"tags":[3]},{"tags":[2,3]},{"tags":[2,3]},{"tags":[1,2]}]