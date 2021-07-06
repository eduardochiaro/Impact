;(function( $ ){
  hljs.highlightAll();
  hljs.addPlugin({
    'after:highlightElement': ({ el, result }) => {
      $("pre code.hljs").html(function(index, html) {
        return html.trim().replace(/^(.*)$/mg, "<span class=\"line\">$1</span>");
      });
    }
  });
})( window.jQuery );