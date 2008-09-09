;(function(_) {

_.fn.extend({
  'join': function() {
    return [].join.apply(this, arguments);
  }
  
  ,to_tree_nodes: function(parent) {
    return this.children().each(function() {
      var _this = _(this)
        ,node = _.tree_node.clone();
       
        _this.tree_node(node);
        node.dom_element(_this);
        node.tag_label().html(_this.tag_name());
        
        node.id_label().html(_this.id()).hide_if_empty();
        
        node.class_list().append(_this.classes_to_dom());

        node.attribute_list().append(_this.attributes_to_dom());
        
        parent.parent_node().not_empty();
        parent.append(node);
        
        _this.to_tree_nodes(node.child_list());
    });
  }
  
  ,tag_label: function() {
    return this.find('label:first');
  } 
  
  ,id_label: function() {
    return this.find('.id:first')
  }
  
  ,hide_if_empty: function() {
    if(this.html() == '') this.hide();
    return this;
  }
  
  ,id: function() {
    return this.attr('id');
  }
  
  ,tag_name: function() {
    return this.attr('tagName').toLowerCase();
  }
  
  ,class_list: function() {
    return this.find('.classes:first');
  }
  
  ,attribute_list: function() {
    return this.find('dl:first');
  }
  
  ,classes: function() {
    var classes = this.attr('class');
    if(classes == '') return [];
    return classes.split(/ /);  
  }
  
  ,classes_to_dom: function() {
    var dom_string = this.classes().map(function(cls) {
      return '<li>'+cls+'</li>';
    }).join('');
    var dom = _(dom_string);
    return dom[0] === document ? null : dom;
  }
  
  ,attributes_to_dom: function() {
    var dom_string = _(this[0].attributes).map(function(which, attr) {
      if(!this.name.match(/id|class/)) {
        return '<dt>'+attr.name+'</dt><dd>'+attr.value+'</dd>';
      }
    }).join('');
    
    var dom = _(dom_string);
    return dom[0] === document ? null : dom; 
  }
  
  ,child_list: function() {
    return this.find('ol:first');
  }
  
  ,parent_node: function() {
    return this.parents('.tree_node:first');
  }
  
  ,not_empty: function() {
    return this.removeClass('empty');
  }
  
  ,dom_element: function(el) {
    if(!el) return this.data('dom_tree element');
    return this.data('dom_tree element', el);
  }
  
  ,tree_node: function(node) {
    if(!node) return this.data('dom_tree node');
    return this.data('dom_tree node', node);
  }
  
  ,clear: function() {
    return this.html('');
  }
  
  ,remove_class_on_all_children: function(cls) {
    this.find('.'+cls).removeClass(cls);
    return this;
  }
  
  ,toggle_button: function() {
    return this.find('.toggle:first');
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
  
  ,dragstart: function(fn) {
    return this.bind('dragstart', fn);
  }
  
  ,dragend: function(fn) {
    return this.bind('dragend', fn);
  }
});

var viewport = _.viewport.clone()
  ,tree = viewport.find('#tree')
  ,iframe = viewport.find('iframe')
  
  ,inspection_class = 'inspected'
  ,drag_class = 'dragging';

_('head').append(_.dom_tree_stylesheet);
_('body').clear().append(viewport);

function clear_all_inspections() {
  iframe.contents().find('body').remove_class_on_all_children(inspection_class);
  viewport.remove_class_on_all_children(inspection_class);
}

iframe
  .load(function() {
    var contents = iframe.contents()
      ,body = contents.find('body');
    
    body.to_tree_nodes(tree.clear());
    
    contents.find('head').append(_.canvas_stylesheet);
    body.mouseover(function(e) {
      clear_all_inspections();
      
      _(e.target)
        .addClass(inspection_class)
        .tree_node()
          .addClass(inspection_class);
    });
  })
  .attr('src', window.location.href + "?");
  
  tree
    .dragstart(function(e) {
      var el = jQuery(e.target)
      if(!el.is('.drag')) return false;
      return el.parent_node()
        .collapse_children()
        .addClass(drag_class);
    })
    .drag(function(e) {
      _(e.dragProxy)
        .css({
          top:e.pageY + 10, 
          left:e.pageX + 10
        })
        .addClass(inspection_class);
    })
    .dragend(function(e) {
      _(e.dragProxy).removeClass(drag_class)
    })
    .mouseover(function(e) {
      var node = _(e.target);
      if(!node.is('.tree_node')) node = node.parent_node();
      clear_all_inspections();
      node
        .addClass(inspection_class)
        .dom_element()
          .addClass(inspection_class);      
    })
    .click(function(e) {
      var el = _(e.target)
        ,node = el.parent_node();
      if(el.is('.destroy')) {
        node
          .dom_element()
            .remove();
        node.remove();
      }
      if(el.is('.block')) {
        el.toggleClass('active');
        if(el.is('.active'))
          node.dom_element().hide();
        else
          node.dom_element().show();
      }
      if(el.is('.toggle')) {
        if(el.is('.closed'))
          node.expand_children(true);
        else
          node.collapse_children(true);
      }
    })
})(jQuery);
