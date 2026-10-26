// Idioma: español por defecto, inglés desde js/i18n.js
(function(){
  var EN = window.I18N_EN || {};
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var arias = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-aria]'));
  var alts = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-alt]'));
  var es = new Map(), esAria = new Map(), esAlt = new Map();
  nodes.forEach(function(n){ es.set(n, n.innerHTML); });
  arias.forEach(function(n){ esAria.set(n, n.getAttribute('aria-label')); });
  alts.forEach(function(n){ esAlt.set(n, n.getAttribute('alt')); });
  var esTitle = document.title;
  var meta = document.querySelector('meta[name="description"]');
  var esDesc = meta ? meta.content : '';

  function apply(lang){
    var en = lang === 'en';
    nodes.forEach(function(n){
      var k = n.getAttribute('data-i18n');
      n.innerHTML = en && EN[k] != null ? EN[k] : es.get(n);
    });
    arias.forEach(function(n){
      var k = n.getAttribute('data-i18n-aria');
      n.setAttribute('aria-label', en && EN[k] != null ? EN[k] : esAria.get(n));
    });
    alts.forEach(function(n){
      var k = n.getAttribute('data-i18n-alt');
      n.setAttribute('alt', en && EN[k] != null ? EN[k] : esAlt.get(n));
    });
    document.documentElement.lang = lang;
    document.title = en ? EN.__title : esTitle;
    if (meta) meta.content = en ? EN.__desc : esDesc;
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  var initial = saved || ((navigator.language || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'es');
  if (initial === 'en') apply('en');

  var toggle = document.querySelector('.lang-toggle');
  if (toggle) toggle.addEventListener('click', function(){
    apply(document.documentElement.lang === 'en' ? 'es' : 'en');
  });
})();

// Estantería de proyectos
(function(){
  var spines = Array.prototype.slice.call(document.querySelectorAll('.spine'));
  if (!spines.length) return;
  function open(spine, focus){
    spines.forEach(function(s){
      var on = s === spine;
      s.setAttribute('aria-pressed', on ? 'true' : 'false');
      document.getElementById(s.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) spine.focus();
  }
  spines.forEach(function(spine, i){
    spine.addEventListener('click', function(){ open(spine); });
    spine.addEventListener('keydown', function(e){
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      open(spines[(i + (e.key === 'ArrowRight' ? 1 : spines.length - 1)) % spines.length], true);
    });
  });

  // Notas al margen del Capítulo III: abren el libro en el estante
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.slice.call(document.querySelectorAll('.note-link')).forEach(function(link){
    link.addEventListener('click', function(){
      var spine = document.querySelector('.spine[aria-controls="libro-' + link.dataset.book + '"]');
      if (!spine) return;
      open(spine);
      document.getElementById('proyectos').scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
    });
  });
})();

// Barra: marcar el capítulo visible
(function(){
  var links = Array.prototype.slice.call(document.querySelectorAll('.navlinks a[href^="#"]'));
  if (!links.length) return;
  var targets = links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  function update(){
    var active = -1;
    targets.forEach(function(t, i){ if (t && t.getBoundingClientRect().top <= 140) active = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = targets.length - 1;
    links.forEach(function(a, i){ a.classList.toggle('active', i === active); });
  }
  window.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update);
  update();
})();
