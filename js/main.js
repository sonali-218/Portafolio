// Pestañas de proyectos
(function(){
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  function select(tab){
    tabs.forEach(function(t){
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function(tab, i){
    tab.addEventListener('click', function(){ select(tab); });
    tab.addEventListener('keydown', function(e){
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next); next.focus();
    });
  });
})();
