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
jQuery.fn.linked_element = function() {
  var $this = this;
};
jQuery.fn.to_tree_nodes = function(parent) {
  var $this = this;
  $this.children().each(function() {var $this = jQuery(this);var node = $.tree_node.clone();node.find('label:first').html($this.attr('tagName').toLowerCase());var idLabel = node.find('.id');idLabel.html($this.attr('id'));if(idLabel.html() == "") idLabel.hide();if(!$this.attr('id')) $this.attr('id', id());node.data('element', $this.attr('id'));node.attr('id', id());jQuery(this).data('node', node.attr('id'));jQuery(jQuery(this).attr('class').split(' ')).each(function(which, class) {if(class !== "")node.find('.classes').append(jQuery('<li>'+class+'</li>'));});var attrs = node.find('dl');jQuery(this.attributes).each(function() {if(!this.name.match(/id|class/))attrs.append("<dt>"+this.name+"</dt><dd>"+this.value+"</dd>");});parent.parents('.tree_node:first').removeClass('empty');parent.append(node);jQuery(this).to_tree_nodes(node.find('ol:first'));
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
    (function($this) {
      $this.html('');
})(jQuery("#tree"));
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
    var node = jQuery(e.target);
    if(!(node.is(".tree_node"))) {
      node = node.parents('.tree_node:first');
}
    (function($this) {
      $this.removeClass('inspected');
})(jQuery(".inspected"));
    node.addClass('inspected');
    (function($this) {
      $this.contents().find('.inspected').removeClass('inspected');
      var element = $this.contents().find('#' + node.data('element'));
      element.addClass('inspected');
})(jQuery("#viewport iframe"));
});
  $this.bind("click", function(e) {
    var $this = jQuery(this);
    var el = jQuery(e.target);
    if(el.is(".destroy")) {
      var node = el.parents('.tree_node:first');
      (function($this) {
        var element = $this.contents().find('#' + node.data('element'));
        node.remove();
        element.remove();
})(jQuery("#viewport iframe"));
}
    (function($this) {
      if(el.is(".block")) {
        var node = el.parents('.tree_node:first');
        el.toggleClass('active');
        var element = $this.contents().find('#' + node.data('element'))         
        if(el.is(".active")) {
          element.hide();
}
        if(!(el.is(".active"))) {
          element.show();
}
}
})(jQuery("#viewport iframe"));
    if(el.is(".toggle")) {
      var list = el.parents('.tree_node:first').find('ol:first');
      el.toggleClass('closed');
      if(el.is(".closed")) {
        list.slideUp();
}
      if(!(el.is(".closed"))) {
        list.slideDown();
}
}
});
})(jQuery("#tree"));
(function($this) {
  $this.bind("keyup", function(e) {
    var $this = jQuery(this);
    var val = $this.attr('value');
    (function($this) {
      var body = $this.contents().find('body');
      body.find('.queried').removeClass('queried');
      if(!(val == "")) {
        body.addClass('masked');
        match = body.find(val);
        match.addClass('queried');
}
      if(val == "") {
        body.removeClass('masked');
}
})(jQuery("#viewport iframe"));
});
})(jQuery("#query"));