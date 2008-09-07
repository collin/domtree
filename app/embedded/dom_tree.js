var viewport = jQuery.viewport.clone();
var _id = 0
function id() {
  return _id++
}
jQuery.fn.info = function() {
  var $this = this;
  var str = $this.attr('tagName').toLowerCase();
  if($this.attr("id")) {
    str += "#" + $this.attr('id');
}
  if(!($this.attr("class") == "")) {
    str += "." + $this.attr('class').split(' ').join('.');
}
  return str;
};
jQuery.fn.to_tree_nodes = function(parent) {
  var $this = this;
  $this.children().each(function() {var $this = jQuery(this);var node = $.tree_node.clone();if(!$this.attr('id')) $this.attr('id', id());node.data('element', $this.attr('id'));node.attr('id', id());jQuery(this).data('node', node.attr('id'));node.find('label:first').html($this.info()); parent.append(node);jQuery(this).to_tree_nodes(node.find('ol:first'));
  });
};
(function($this) {
  $this.append(jQuery.dom_tree_stylesheet);
})(jQuery("head"));
(function($this) {
  $this.html("");
  $this.append(viewport);
})(jQuery("body"));
(function($this) {
  $this.attr('src', window.location.href + "?");
  $this.bind("load", function(e) {
    var $this = jQuery(this);
    var body = $this.contents().find('body');
    body.to_tree_nodes(jQuery('#tree'));
    $this.contents().find('head').append($.canvas_stylesheet);
    body.bind('mouseover', function(e) {var el = jQuery(e.target);body.find('.inspected').removeClass('inspected');el.addClass('inspected');var node = el.data('node');jQuery('.inspected').removeClass('inspected');jQuery('#'+node).addClass('inspected');
    });
});
})(jQuery("#viewport iframe"));
(function($this) {
  $this.bind("mouseover", function(e) {
    var $this = jQuery(this);
    var el = jQuery(e.target);
    if(!(el.is("li"))) {
      el = el.parents('li:first');
}
    (function($this) {
      $this.removeClass('inspected');
})(jQuery(".inspected"));
    el.addClass('inspected');
    (function($this) {
      $this.contents().find('.inspected').removeClass('inspected');
      var element = $this.contents().find('#' + el.data('element'));
      element.addClass('inspected');
})(jQuery("#viewport iframe"));
});
})(jQuery("#tree"));