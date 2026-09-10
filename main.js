/* ============================================================
   刘一锟 · LIU YIKUN — PORTFOLIO  /  main.js
   滚动渐显 · 顶栏状态 · 导航定位 · 代表作品轮播 · 文字带循环
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 年份 ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- 滚动渐显 ---------- */
  var rvs = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 顶栏：滚动后加底色 ---------- */
  var top = document.getElementById('siteTop');
  var ticking = false;
  function onScroll() {
    if (top) top.classList.toggle('is-scrolled', (window.scrollY || window.pageYOffset) > 40);
    spy();
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- 导航当前区块高亮 ---------- */
  var secs = Array.prototype.slice.call(document.querySelectorAll('section[id], footer[id]'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[data-spy]'));
  var last = '';
  function spy() {
    if (!links || !links.length) return;
    var cur = '';
    secs.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= 160 && r.bottom > 160) cur = '#' + s.id;
    });
    if (cur === last) return;
    last = cur;
    links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === cur); });
  }

  /* ---------- 文字带：内容复制一份实现无缝循环 ---------- */
  Array.prototype.slice.call(document.querySelectorAll('.marquee-track')).forEach(function (track) {
    var inner = track.innerHTML;
    if (track.children.length && !track.dataset.cloned) {
      track.innerHTML = inner + inner;
      track.dataset.cloned = '1';
    }
  });

  /* ---------- 作品列表：悬停小缩略图预览 ---------- */
  /* 预览节点 #wkPreview 为 body 直属 fixed 元素，跟随鼠标并始终钳制在视口内，不遮挡文字与点击 */
  var wkPreview = document.getElementById('wkPreview');
  var workList = document.querySelector('.work-list');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (wkPreview && workList && canHover) {
    var wkImg = wkPreview.querySelector('img');
    var WK_W = 220, WK_H = 140, WK_PAD = 12, WK_OFF = 22;
    var wkX = 0, wkY = 0, wkOn = false;

    /* 预加载各作品首图，避免首次悬停时闪空 */
    Array.prototype.slice.call(workList.querySelectorAll('.work-row[data-thumb]')).forEach(function (row) {
      var pre = new Image();
      pre.src = row.getAttribute('data-thumb');
    });

    function placeWkPreview() {
      var vw = window.innerWidth, vh = window.innerHeight;
      var left = wkX + WK_OFF;
      var top = wkY - WK_H / 2;
      if (left + WK_W > vw - WK_PAD) left = wkX - WK_OFF - WK_W;
      if (left < WK_PAD) left = WK_PAD;
      if (left + WK_W > vw - WK_PAD) left = vw - WK_PAD - WK_W;
      if (top < WK_PAD) top = WK_PAD;
      if (top + WK_H > vh - WK_PAD) top = vh - WK_PAD - WK_H;
      wkPreview.style.left = Math.round(left) + 'px';
      wkPreview.style.top = Math.round(top) + 'px';
    }

    workList.addEventListener('mouseover', function (ev) {
      var el = ev.target;
      var row = (el && el.closest) ? el.closest('.work-row') : null;
      var src = row ? row.getAttribute('data-thumb') : null;
      if (!src) { wkPreview.classList.remove('is-on'); wkOn = false; return; }
      if (wkImg.getAttribute('src') !== src) wkImg.setAttribute('src', src);
      wkX = ev.clientX; wkY = ev.clientY;
      placeWkPreview();
      wkPreview.classList.add('is-on');
      wkOn = true;
    });

    workList.addEventListener('mousemove', function (ev) {
      if (!wkOn) return;
      wkX = ev.clientX; wkY = ev.clientY;
      placeWkPreview();
    });

    workList.addEventListener('mouseleave', function () {
      wkPreview.classList.remove('is-on');
      wkOn = false;
    });

    window.addEventListener('resize', function () {
      wkPreview.classList.remove('is-on');
      wkOn = false;
    }, { passive: true });
  }

  /* ---------- 首屏代表作品轮播 ---------- */
  var slider = document.getElementById('reelSlider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.reel-slide'));
    var btns = Array.prototype.slice.call(document.querySelectorAll('.reel-dropbtn'));
    var line = document.querySelector('.reel-line .fill');
    var caption = document.getElementById('reelLink');
    var COPY = window.REEL_COPY || [];
    var STEP = 4000;
    var cur = 0;
    var hold = false;
    var timer = null;
    var copySeq = 0;

    function usable() {
      return slides.map(function (s, i) { return i; })
        .filter(function (i) { return !slides[i].classList.contains('is-broken'); });
    }

    function paint(idx) {
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      btns.forEach(function (b, i) {
        b.classList.toggle('is-active', i === idx);
        b.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
      if (line) {
        line.classList.remove('is-run');
        void line.offsetWidth;
        if (!reduced) line.classList.add('is-run');
      }
      var c = COPY[idx];
      if (!c || !caption) return;
      var token = ++copySeq;
      caption.classList.add('is-fading');
      window.setTimeout(function () {
        if (token !== copySeq) return;
        caption.querySelector('.rc-no').textContent = c.no;
        caption.querySelector('.rc-name').textContent = c.name;
        caption.querySelector('.rc-desc').textContent = c.desc;
        caption.setAttribute('href', c.href);
        caption.classList.remove('is-fading');
      }, 220);
    }

    function go(step) {
      var list = usable();
      if (!list.length) return;
      var pos = list.indexOf(cur);
      if (pos < 0) pos = 0;
      cur = list[(pos + step + list.length) % list.length];
      paint(cur);
    }

    function start() {
      window.clearInterval(timer);
      if (reduced || slides.length < 2) return;
      timer = window.setInterval(function () { if (!hold) go(1); }, STEP);
    }

    slides.forEach(function (s) {
      var img = s.querySelector('img');
      if (img) {
        img.addEventListener('error', function () {
          s.classList.add('is-broken');
          if (s.classList.contains('is-active')) go(1);
        });
      }
    });

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { cur = i; paint(i); start(); });
    });

    /* ---------- 液态水滴指示器：水滴跟随光标，靠近时相互吸引融合（gooey metaball） ---------- */
    var stageEl = document.querySelector('.reel-stage');
    var dropSvg = document.querySelector('.reel-dropsvg');
    var dropG = document.querySelector('.reel-dropg');
    var fxCur = document.querySelector('.drop-fx');
    if (btns.length && dropSvg && dropG && fxCur && stageEl) {
      var drops = btns.map(function () {
        var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('class', 'drop');
        c.setAttribute('r', '5.5');
        dropG.appendChild(c);
        return { el: c, bx: 0, by: 0, x: 0, y: 0, r: 5.5 };
      });
      var fx = { x: -100, y: -100, tx: -100, ty: -100 };

      function layoutDrops() {
        /* 水滴坐标按公式计算（左内边距起、46px 间距、距底 28px），按钮与圆点共用同一套数值 */
        var pad = parseFloat(getComputedStyle(stageEl).paddingLeft) || 28;
        var spacing = 46;
        var sr = stageEl.getBoundingClientRect();
        btns.forEach(function (b, i) {
          var x = pad + spacing * i + 22;
          var y = sr.height - 28;
          b.style.left = x + 'px';
          var d = drops[i];
          if (!d) return;
          d.bx = x;
          d.by = y;
          if (!d.x) { d.x = x; d.y = y; }
        });
      }
      layoutDrops();
      window.addEventListener('resize', layoutDrops, { passive: true });

      stageEl.addEventListener('mousemove', function (e) {
        var sr = stageEl.getBoundingClientRect();
        fx.tx = e.clientX - sr.left;
        fx.ty = e.clientY - sr.top;
        dropSvg.classList.add('is-hover');
      }, { passive: true });
      stageEl.addEventListener('mouseleave', function () {
        dropSvg.classList.remove('is-hover');
        fx.tx = -100;
        fx.ty = -100;
      });

      if (reduced) {
        /* 减弱动效：水滴静止陈列，仅随切换变主色 */
        drops.forEach(function (d, i) {
          d.el.setAttribute('cx', d.bx);
          d.el.setAttribute('cy', d.by);
          d.el.classList.toggle('is-active', i === cur);
        });
      } else {
        (function dropTick() {
          try {
            var ACTIVE = 9, BASE = 5.5, PULL = 22, RANGE = 120;
            fx.x += (fx.tx - fx.x) * 0.18;
            fx.y += (fx.ty - fx.y) * 0.18;
            fxCur.setAttribute('cx', fx.x.toFixed(1));
            fxCur.setAttribute('cy', fx.y.toFixed(1));
            drops.forEach(function (d, i) {
              var dx = fx.x - d.bx, dy = fx.y - d.by;
              var dist = Math.sqrt(dx * dx + dy * dy) || 1;
              var pull = dist < RANGE ? (1 - dist / RANGE) : 0;
              var tx = d.bx + (dx / dist) * pull * PULL;
              var ty = d.by + (dy / dist) * pull * PULL;
              d.x += (tx - d.x) * 0.22;
              d.y += (ty - d.y) * 0.22;
              var tr = (i === cur ? ACTIVE : BASE) + pull * 3.5;
              d.r += (tr - d.r) * 0.2;
              d.el.setAttribute('cx', d.x.toFixed(1));
              d.el.setAttribute('cy', d.y.toFixed(1));
              d.el.setAttribute('r', d.r.toFixed(2));
              d.el.classList.toggle('is-active', i === cur);
            });
          } catch (err) {
            (window.__dropErrs = window.__dropErrs || []).push(String(err && err.message || err));
          }
          window.requestAnimationFrame(dropTick);
        })();
      }
    }

    var stage = document.querySelector('.reel-stage');
    if (stage) {
      ['mouseenter', 'touchstart'].forEach(function (ev) {
        stage.addEventListener(ev, function () { hold = true; }, { passive: true });
      });
      ['mouseleave', 'touchend', 'touchcancel'].forEach(function (ev) {
        stage.addEventListener(ev, function () { hold = false; }, { passive: true });
      });
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { window.clearInterval(timer); } else { start(); }
    });

    paint(0);
    start();
  }

  /* ---------- 动效增强：字标逐字入场 · 顶部进度条 · 光标跟随点 · 速度感应文字带 ---------- */
  if (!reduced) {

    /* 首屏字标拆字（保留 wm-accent / wm-dot 配色类） */
    Array.prototype.slice.call(document.querySelectorAll('.wordmark')).forEach(function (wm) {
      var frag = document.createDocumentFragment();
      var idx = 0;
      function push(ch, cls) {
        if (!ch.trim() && ch !== ' ') return;
        var s = document.createElement('span');
        s.className = 'wm-ch' + (cls ? ' ' + cls : '');
        s.style.setProperty('--i', idx++);
        s.textContent = ch;
        frag.appendChild(s);
      }
      Array.prototype.slice.call(wm.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          Array.prototype.forEach.call(n.textContent, function (c) { push(c, ''); });
        } else if (n.nodeType === 1) {
          Array.prototype.forEach.call(n.textContent, function (c) { push(c, n.className); });
        }
      });
      wm.textContent = '';
      wm.appendChild(frag);
    });

    /* 注入进度条与光点 */
    var prog = document.createElement('span');
    prog.className = 'scroll-progress';
    document.body.appendChild(prog);

    var fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var cursor = document.createElement('span');
    cursor.className = 'cursor-dot';
    if (fineHover) document.body.appendChild(cursor);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2, cx = mx, cy = my;
    var cs = 1, csTarget = 1, cursorOn = false;
    if (fineHover) {
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        if (!cursorOn) { cursorOn = true; cursor.classList.add('is-on'); }
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', function () {
        cursorOn = false; cursor.classList.remove('is-on');
      });
      document.addEventListener('mouseover', function (e) {
        var hit = e.target.closest && e.target.closest('a, button');
        csTarget = hit ? 3.1 : 1;
        cursor.classList.toggle('is-link', !!hit);
      }, { passive: true });
    }

    /* 速度感应文字带：滚动越快跑得越快并产生斜切，悬停暂停 */
    var tracks = Array.prototype.slice.call(document.querySelectorAll('.marquee-track, .logo-track'));
    var offs = tracks.map(function () { return 0; });
    tracks.forEach(function (t) { t.classList.add('is-driven'); });
    var lastY = window.pageYOffset;
    var vel = 0;

    (function tick() {
      var y = window.pageYOffset;
      vel += ((y - lastY) - vel) * 0.14;
      lastY = y;

      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0).toFixed(4) + ')';

      if (fineHover) {
        cx += (mx - cx) * 0.22;
        cy += (my - cy) * 0.22;
        cs += (csTarget - cs) * 0.2;
        cursor.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) scale(' + cs.toFixed(3) + ')';
      }

      var sk = Math.max(-12, Math.min(12, vel * 0.3));
      for (var i = 0; i < tracks.length; i++) {
        var t = tracks[i];
        var half = t.scrollWidth / 2;
        if (half > 0) {
          var speed = t.matches(':hover') ? 0 : (0.7 + Math.min(Math.abs(vel) * 0.22, 9));
          offs[i] = (offs[i] + speed) % half;
          t.style.transform = 'translateX(' + (-offs[i]).toFixed(2) + 'px) skewX(' + sk.toFixed(2) + 'deg)';
        }
      }
      window.requestAnimationFrame(tick);
    })();
  }
})();
