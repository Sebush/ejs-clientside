/**
 * client-renderer (ejs)
 */
_.templateSettings = {evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%-([\s\S]+?)%>/g, escape: /<%=([\s\S]+?)%>/g};
window.ejs = {
    _cache: {},
    render: function(text, data){
        text = text.replace(
            /<%\-?\=?\s*include\s*(.*?)\s*\-?%>/g,
            function(match, path) {
                return window.ejs.renderFile('/'+path, data);
            }
        );
        text = text.replace(
            /<%\-?\=?\s*layout\(.*\)\s*\-?%>/g,
            function(match, path) {
                return '';
            }
        );
        return _.template(text)(data);
    },
    renderFile: function(path, data, cb){
        var self = this;
        var result = null;
        if(self._cache[path]){
            result = self.render(self._cache[path], data);
        }else{
            jQuery.ajax({
                url: path,
                async: false
            }).done(function(text) {
                result = self.render(self._cache[path] = text, data);
            }).fail(function() {
                console.error('error ajax renderFile');
            });
        }
        return cb && cb(null, result) || result;
    }
};
// TODO:
// eigenes modul!
// var layout = function(){};
// var partial = function(){};
// var include = function(){};
// var blocks = function(){};
