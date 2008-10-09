;(function(_){
_.fn.extend({  
  to_tree_nodes: function(parent) {
    return this.children().each(function() {
      _(this).to_tree_node(parent);
    });
  }
  
  ,to_tree_node: function(parent) {
      var _this = _(this)
        ,node = _.tree_node.clone();
       
      _this.tree_node(node);
      node.dom_element(_this);
      
      node.paint_node(_this);
      
      parent.parent_node().not_empty();
      parent.append(node);
      
      _this.to_tree_nodes(node.child_list());
  }
  
  ,child_list: function() {
    if(this.is('ol')) return this;
    return this.find('ol:first');
  }
  
  ,parent_node: function() {
    var node = this.parents('.tree_node:first');
    if(node.length) return node;
    return this.filter('.tree_node');
  }
  
  ,collapse_children: function(slide) {
    if(slide)
      this.child_list().slideUp();
    else
      this.child_list().hide();
    this.toggle_button().addClass('closed');
    return this;
  }
  
  ,expand_children: function(slide) {
    if(slide)
      this.child_list().slideDown();
    else
      this.child_list().show();
    this.toggle_button().removeClass('closed');
    return this;
  }
  
  ,toggle_button: function() {
    return this.find('.toggle:first');
  }
});
})(jQuery);
