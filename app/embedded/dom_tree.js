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
        
        node.paint_node(_this);
        
        parent.parent_node().not_empty();
        parent.append(node);
        
        _this.to_tree_nodes(node.child_list());
    });
  }
  
  ,paint_node: function(el) {
    this.tag_label().html(el.tag_name());
    this.id_label().html(el.id()).hide_if_empty();
    this.class_list().append(el.classes_to_dom());
    this.attribute_list().append(el.attributes_to_dom());
    return this;
  }
  
  ,tag_label: function() {
    return this.find('label:first');
  } 
  
  ,id_label: function() {
    return this.find('.id:first')
  }
  
  ,hide_if_empty: function() {
    return this.if_empty(function(){this.hide();});
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
        return '<li><dt>'+attr.name+'</dt><dd>'+attr.value+'</dd></li>';
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
    if(!el) {
      var dom = this.data('dom_tree element');
      return dom === undefined ? _([]) : dom; 
    }
    var dom = this.data('dom_tree element', el);
  }
  
  ,tree_node: function(node) {
    if(!node) {
      var tree_node = this.data('dom_tree node');
      return tree_node === undefined ? _([]) : tree_node; 
    }
    return this.data('dom_tree node', node);
  }
  
  ,clear: function() {
    return this.html('');
  }
  
  ,remove_class_on_all_children_and_self: function(cls) {
    this.find('.'+cls).removeClass(cls);
    this.removeClass(cls);
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
  
  ,size_to_fit: function() {
    return this.attr('size', this.val().length || 1);
  }
  
  ,keyup_size_to_fit: function() {
    return this.keyup(function(e) {
      _(this).size_to_fit();
    });
  }

/*
  label: the jqueried label
  input: the jqueried input elment

  insertion_method: method to insert the input: 'append', 'before', etc.
    defaults to 'after'
  do_not_hide_label: keep the label around so it's css will apply
  default_value: set the label to this if the value is ""
  hide_if_empty: hide the label if the value is ""
  remove_if_empty: remove the label if the value is ""
*/

  ,edit_label: function(opts) {
    var label = opts.label
      ,input = opts.input;
      
    this.blur_all();
    input.val(label.text());
    
    if(opts.do_not_hide_label) label.clear().css('display', '');
    else label.hide();
    
    label[opts.insertion_method || 'after'](input.show());
    
    input
      .size_to_fit()
      .one('blur', function() {
        _(document.body).append(input.hide());
        if(opts.default_value) {
          label
            .html(input.val() || opts.default_value)
            .show();
        }
        else if(opts.hide_if_empty) {      
          label
            .html(input.val())
          label.hide_if_empty();
        }
        else if(opts.remove_if_empty) {
          label
            .html(input.val())
            .remove_if_empty();
        }
        else if(opts.if_empty) {
          label
            .html(input.val())
            .if_empty(opts.if_empty);
        }
      });
    
    setTimeout(function(){input.focus();}, 1);
    return this;
  }
  
  ,edit_tag_name: function() {
    return this.edit_label({
      label: this.tag_label()
      ,input: _.tag_input
      ,default_value: 'div'
    });
  }
  
  ,edit_id: function() {
    return this.edit_label({
      label: this.id_label()
      ,input: _.id_input
      ,hide_if_empty: true
      ,do_not_hide_label: true
    });
  } 
  
  ,previous_class: function(cls) {
    var prev = cls.prev('li').prev('li').prev('li');
    if(prev.length) return this.edit_class(prev);
    return this.edit_id();
  }
  
  ,next_class: function(cls) {
    var next = cls.next('li');
    if(next.length) return this.edit_class(next);
    return this.edit_attrs();
  }
  
  ,edit_classes: function() {
    var first_class = this.class_list().find('li:first');
    if(first_class.length) return this.edit_class(first_class);
    
    return this.new_class();    
  }
  
  ,new_class: function() {
    var cls = _('<li>');
    this.class_list().append(cls);
    return this.edit_class(cls);
  }
  
  ,edit_class: function(label) {
    return this.edit_label({
      label: label
      ,input: _.class_input
      ,remove_if_empty: true
      ,do_not_hide_label: true
    }); 
  } 
  
  ,edit_attrs: function() {
    var first_attr = this.attribute_list().find('li:first');
    
    if(first_attr.length) return this.edit_attr(first_attr);
    
    return this.new_attr();    
  }
  
  ,new_attr: function() {
    var attr = _('<li><dt><dd></li>');
    this.attribute_list().append(attr);
    return this.edit_attr(attr);
  }
  
  ,previous_attr: function(attr) {
    var prev = attr.prev('li');
    if(prev.length) return this.edit_value(prev);
    var last_class = this.last_class();
    return last_class.length ? this.edit_class(this.last_class()) : this.new_class();
  }
  
  ,next_attr: function(attr) {
    var next = attr.next('li');
    if(next.length) return this.edit_attr(next);
    return this.parent_node().new_attr();
  }
  
  ,edit_attr: function(label) {
    return this.edit_label({
      label: label.find('dt')
      ,input: _.attr_input
      ,insertion_method: 'before'
      ,if_empty: function() {this.parent().remove()}
      ,do_not_hide_label: true
    });
  }
  
  ,edit_value: function(label) {
    return this.edit_label({
      label: label.find('dd')
      ,input: _.value_input
      ,insertion_method: 'append'
      ,do_not_hide_label: true
    });
  }
  
  ,remove_if_empty: function() {
    return this.if_empty(function() {this.remove();});
  }
  
  ,if_empty: function(fn) {
    if(this.html() === "") fn.call(this);
    return this;
  }
  
  ,blur_all: function() {
    this.find('input').blur();
    return this;
  }
  
  ,last_class: function() {
    return this.class_list().find('li:last');
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
  iframe.contents().find('body').remove_class_on_all_children_and_self(inspection_class);
  viewport.remove_class_on_all_children_and_self(inspection_class);
}

function edit_id() {
  _(this).parent_node().edit_id();
}

function edit_classes() {
  _(this).parent_node().edit_classes();
}

function new_class() {
  _(this).parent_node().new_class();
}

function next_class() {
  var _this = _(this);
  _this.parent_node().next_class(_this);
}

function previous_class() {
  var _this = _(this);
  _this.parent_node().previous_class(_this);
}

function edit_attr() {
  var _this = _(this);
  _this.parent_node().edit_attr(_this.parents('li:first'));
}

function edit_value() {
  var _this = _(this);
  _this.parent_node().edit_value(_this.parent());
}

function previous_attr() {
  var _this = _(this);
  _this.parent_node().previous_attr(_this.parents('li:first'));
}

function next_attr() {
  var _this = _(this);
  _this.parent().next_attr(_this);
}

_.tag_input
  .keyup_size_to_fit()
  .keybind('tab', edit_id)
  .keybind('shift+3', edit_id)
  .keybind('space', edit_id)
  .keybind('shift+tab', edit_classes)
  .keybind('.', edit_classes);

  
_.id_input
  .keyup_size_to_fit()
  .keybind('.', edit_classes)
  .keybind('tab', edit_classes)
  .keybind('space', edit_classes);

_.class_input
  .keyup_size_to_fit()
  .keybind('tab', next_class)
  .keybind('.', new_class)
  .keybind('space', new_class)
  .keybind('shift+tab', previous_class)

_.attr_input
  .keybind('=', edit_value)
  .keybind('tab', edit_value)
  .keybind('space', edit_value)
  .keybind('shift+tab', previous_attr)
  .keyup_size_to_fit();

function prep_value_input() {  
  _.value_input
    .keybind('tab', next_attr)
    .keybind('shift+tab', edit_attr)
    .keyup_size_to_fit();
}

prep_value_input();

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
      // Destroying the inputs not desired.
      node.blur_all();
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
    
    _(window)
      .click(function() {this.focus();})
      .keybind('enter', function(e) {
        tree.blur_all();
        var node = _.tree_node.clone().edit_tag_name();
        node.id_label().hide_if_empty();
        tree.append(node);
      });
      
})(jQuery)
