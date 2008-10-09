javascript:(function() {
var s=document.createElement('script');
s.setAttribute('src','http://localhost:4567/embedded.js?');
if(typeof loadedDomTree != 'undefined') {
  var msg='This page already using domTree';
} else {
  document.getElementsByTagName('head')[0].appendChild(s);
  var msg='This page is now using domTree';
  loadedDomTree = true;
}
var el=document.createElement('div');
  el.style.position='fixed';
  el.style.height='30';
  el.style.width='200';
  el.style.margin='0 auto';
  el.style.top='0';
  el.style.left='40%';
  el.style.padding='5px 10px 5px 10px';
  el.style.backgroundColor='#f99';
  el.innerHTML=msg;
var b=document.getElementsByTagName('body')[0];
b.appendChild(el);
window.setTimeout(function() {
  jQuery(el).fadeOut('slow',function() {
	  jQuery(this).remove();
  });
}, 2500);
})();
