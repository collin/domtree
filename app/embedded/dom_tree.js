;(function(_) {

_.special_keys = {
	27:'esc',
	27:'escape',
	9:'tab',
	32:'space',
	13:'return',
	13:'enter',
	8:'backspace',

	145:'scrolllock',
	145:'scroll_lock',
	145:'scroll',
	20:'capslock',
	20:'caps_lock',
	20:'caps',
	144:'numlock',
	144:'num_lock',
	144:'num',
	
	19:'pause',
	19:'break',
	
	45:'insert',
	36:'home',
	46:'delete',
	35:'end',
	
	33:'pageup',
	33:'page_up',
	33:'pu',

	34:'pagedown',
	34:'page_down',
	34:'pd',

	37:'left',
	38:'up',
	39:'right',
	40:'down',

	112:'f1',
	113:'f2',
	114:'f3',
	115:'f4',
	116:'f5',
	117:'f6',
	118:'f7',
	119:'f8',
	120:'f9',
	121:'f10',
	122:'f11',
	123:'f12',
	
	188:',',
	190:'.'
};

_.shift_nums = {
	"`":"~",
	"1":"!",
	"2":"@",
	"3":"#",
	"4":"$",
	"5":"%",
	"6":"^",
	"7":"&",
	"8":"*",
	"9":"(",
	"0":")",
	"-":"_",
	"=":"+",
	";":":",
	"'":"\"",
	",":"<",
	".":">",
	"/":"?",
	"\\":"|"
};

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
  
  ,size_to_fit: function() {
    return this.attr('size', this.val().length || 1);
  }
  
  ,keyup_size_to_fit: function() {
    return this.keyup(function(e) {
      _(this).size_to_fit();
    });
  }
  
  ,edit_tag_name: function() {
    var label = this.tag_label()
      ,input = _.tag_input;
    
    label.after(input.show());
    input.val(label.text());
    label.hide();
    
    input
      .size_to_fit()
      .one('blur', function() {
        label.html(input.val());
        _(document.body).append(input.hide());
        label.show();
      });
    
    setTimeout(function(){input.focus();}, 1);
    return this;
  }
  
  ,edit_id: function() {
    var label = this.id_label()
      ,input = _.id_input;
    
    label.after(input.show());
    input.val(label.text());
    label.clear().css('display', '');
    
    input
      .size_to_fit()
      .one('blur', function() {
        label.html(input.val());
        _(document.body).append(input.hide());
      });
    
    setTimeout(function(){input.focus();}, 1);
    return this;
  } 
  ,edit_classes: function() {
    var class_list = this.class_list()
      ,first_class = class_list.eq(0);
    
    if(first_class) return first_class.edit_class();
    
    var cls = _('<li>');
    class_list.append(cls);
    return this.edit_class(cls);    
  }
  
  ,edit_class: function(label) {
    var input = _.class_input;
    
    label.after(input.show());
    input.val(label.text());
    label.clear().css('display', '');
    
    input
      .size_to_fit()
      .one('blur', function() {
        label.html(input.val());
        _(document.body).append(input.hide());
      });
    
    setTimeout(function(){input.focus();}, 1);
    return this;
  }
  
  ,blur_all: function() {
    this.find('input').blur();
    return this;
  }
  
  ,keybindings: function(bindings) {
    var old = this.data('keybindings') || {};
    if(bindings) {
      return this.data('keybindings', _.extend(old, bindings));
    } 
    return old;
  }
  
  ,keybind: function(binding, fn) {
    var bindings = {}
      ,that = this;
    bindings[binding] = fn;
    this.keybindings(bindings);
    if(!this.data('keybound')) {
      this.data('keybound', true);
      this.keydown(function(e){
        var bindings = that.keybindings()
          ,binding
          ,keys
          ,modified
          ,matched
          ,modKeys = 'shift ctrl alt meta'.split(/ /)
          ,key; 
        
        console.log(e.which, e.keyCode, _.special_keys[e.keyCode])
        if(_.special_keys[e.keyCode]) key = _.special_keys[e.keyCode];        
        else if(e.which == 188) key=","; //If the user presses , when the type is onkeydown
			  else if(e.which == 190) key="."; //If the user presses , when the type is onkeydown
        else if(e.which != 0) key = String.fromCharCode(e.which); 
        
        for(binding in bindings) {
          modified = true;
          _(modKeys).each(function() {
            // false if the modifier is wanted, but it isn't given
            if(binding.match(this) !== null) modified = e[this+"Key"];
            //console.log(binding.match(this) !== null, this, binding, modified, e[this+"Key"])
          });
          keys = binding.replace(/shift|ctrl|alt|meta/, '').split(/\++/);
          matched = false;
          _(keys).each(function() {
            console.log("THIS:", this, "KEY", key)
            if(this !== "") matched = (this == key);
          });
          console.log('modified', modified, 'matched', matched)
          if(modified && matched) {
            bindings[binding](e);
            e.preventDefault();
          }
        }
      });
    }
    return this;
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

function edit_id() {
  var node = _.tag_input.parent_node();
  node.blur_all();
  node.edit_id();
}

function edit_classes() {
  var node = _.id_input.parent_node();
  node.blur_all();
  node.edit_classes();
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
  .keybind('tab', edit_classes)
  .keybind('.', edit_classes)
  .keybind('space', edit_classes);

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
      .bind('keydown', 'return', function(e) {
        tree.blur_all();
        var node = _.tree_node.clone().edit_tag_name();
        node.id_label().hide_if_empty();
        tree.append(node);
      });
      
})(jQuery);
