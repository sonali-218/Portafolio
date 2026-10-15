document.querySelectorAll('.copy').forEach(function(btn){
  btn.addEventListener('click', function(){
    var el = document.getElementById(btn.dataset.target), text = el.textContent;
    function done(){ btn.textContent = 'Copiado'; setTimeout(function(){ btn.textContent = 'Copiar'; }, 1800); }
    function fallback(){
      var r = document.createRange(); r.selectNodeContents(el);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      btn.textContent = 'Seleccionado, usa ⌘C';
    }
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch(e){ fallback(); }
  });
});
