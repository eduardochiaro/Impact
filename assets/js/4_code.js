;(function( $ ){
  hljs.highlightAll();
  hljs.addPlugin({
    'after:highlightElement': ({el, result}) => {
      $(el).html(function(index, html) {
        return html.trim().replace(/^(.*)$/mg, "<span class=\"line\">$1</span>");
      });
    }
  });
})( window.jQuery );