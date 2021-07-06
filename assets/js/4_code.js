
;(function( $ ){
  setTimeout(() => {

    $("pre code.hljs").html(function(index, html) {
      return html.trim().replace(/^(.*)$/mg, "<span class=\"line\">$1</span>");
    });
  }, 500);
})( window.jQuery );
