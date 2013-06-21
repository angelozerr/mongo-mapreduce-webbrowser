
${namespace}.mapFunc=function () {
    // see http://cookbook.mongodb.org/patterns/count_tags/
    if (!this.tags) {
        return;
    }
    for (index in this.tags) {
        emit(this.tags[index], 1);
    }
}
${namespace}.reduceFunc=function (previous, current) {
    var count = 0;

    for (index in current) {
        count += current[index];
    }

    return count;
}
${namespace}.document=[{"title":"A blog post","author":"Kristina","content":"...","tags":["MongoDB","Map/Reduce","Recipe"]},{"title":"A second blog post","author":"Blablabla","content":"...","tags":["Map/Reduce"]}]