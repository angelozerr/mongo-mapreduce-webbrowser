
${namespace}.mapFunc=function () {
  // see http://cookbook.mongodb.org/patterns/unique_items_map_reduce/
  day = Date.UTC(this.date.getFullYear(), 
                 this.date.getMonth(), 
                 this.date.getDate()); 
  emit({day: day, user_id: this.user_id}, {count: 1});
}
${namespace}.reduceFunc=function (key, values) {
  var count = 0;

  values.forEach(function(v) {
    count += v.count;//v['count'];
  });

  return {count: count};
}
${namespace}.document=[{"url":"http://example.com/photos","user_id":{"$oid":"4be1c916e031933119d78b30"},"date":{"$date":"2012-12-25T01:14:21.312Z"}}]