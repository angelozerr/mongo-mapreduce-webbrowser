
${namespace}.mapFunc=function () {
  // see http://cookbook.mongodb.org/patterns/finding_max_and_min_values_for_a_key/
  var x = { page_views : this.page_views , _id : this._id };
  emit(this.author, { min : x , max : x } )
}
${namespace}.reduceFunc=function (key, values) {
  var res = values[0];
    for ( var i=1; i<values.length; i++ ) {
        if ( values[i].min.page_views < res.min.page_views ) 
           res.min = values[i].min;
        if ( values[i].max.page_views > res.max.page_views ) 
           res.max = values[i].max;
    }
    return res;
}
${namespace}.document=[{
    "_id" : "post 1",
    "author" : "Bob",
    "content" : "...",
    "page_views" : 5
},
{
    "_id" : "post 2",
    "author" : "Bob",
    "content" : "...",
    "page_views" : 9
},
{
    "_id" : "post 3",
    "author" : "Bob",
    "content" : "...",
    "page_views" : 8
}]