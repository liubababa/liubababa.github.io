/* 悬停唤出式顶部导航控制（nav.js）
   行为：
   - 平时导航整体上滑隐藏，仅保留页面顶部 6px 细提示带（HTML 中 .peek）；
   - 鼠标移入顶部提示带 / 点击提示带（触屏）/ 滚动回页面顶部 时滑出；
   - 鼠标离开导航面板约 400ms 后自动收起；
   - 向下滚动离开顶部后回到“悬停唤出”收起态。
   依赖 index.html 与各 work-*.html 中的 <nav class="top" id="siteTop"> 结构。 */
(function () {
  'use strict';
  var nav = document.getElementById('siteTop');
  if (!nav) return;

  var bar = nav.querySelector('.bar');
  var peek = nav.querySelector('.peek');
  var OPEN = 'nav-open';
  /* 触屏（无 hover）设备标记：用于规避移动端合成 mouseenter 与 click 双触发导致的“展开即收起” */
  var touchLike = !!(window.matchMedia && window.matchMedia('(hover:none)').matches);
  var lastHoverOpen = 0;
  var closeTimer = null;
  var yPrev = window.pageYOffset || document.documentElement.scrollTop || 0;
  var tickPending = false;

  function scrollY() {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }
  function setAria(open) {
    if (peek) peek.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function openNav() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    nav.classList.add(OPEN);
    setAria(true);
  }
  function closeNav(immediate) {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    var doClose = function () {
      nav.classList.remove(OPEN);
      setAria(false);
    };
    if (immediate) { doClose(); }
    else { closeTimer = setTimeout(doClose, 400); }
  }

  /* 顶部提示带：hover 展开；触屏单击切换 */
  if (peek) {
    peek.addEventListener('mouseenter', function () {
      lastHoverOpen = Date.now();
      openNav();
    });
    peek.addEventListener('click', function (e) {
      e.stopPropagation();
      /* 触屏：若本次点击前刚由合成 mouseenter 展开，则不再切换，避免“展开后立刻收起” */
      if (touchLike && Date.now() - lastHoverOpen < 700) { openNav(); return; }
      if (nav.classList.contains(OPEN)) { closeNav(true); }
      else { openNav(); }
    });
    peek.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (nav.classList.contains(OPEN)) { closeNav(true); }
        else { openNav(); }
      }
    });
  }
  /* 展开面板：hover 保持，离开后延迟收起 */
  if (bar) {
    bar.addEventListener('mouseenter', openNav);
    bar.addEventListener('mouseleave', function () { closeNav(false); });
  }
  /* 键盘焦点进入导航时展开 */
  nav.addEventListener('focusin', openNav);

  /* 触屏：点选任一菜单项后立即收起（触屏无 mouseleave，避免导航遮挡内容） */
  Array.prototype.forEach.call(nav.querySelectorAll('.menu a'), function (a) {
    a.addEventListener('click', function () {
      if (touchLike) { closeNav(true); }
    });
  });

  /* 触屏：展开状态下点击导航之外区域收起 */
  document.addEventListener('click', function (e) {
    if (nav.classList.contains(OPEN) && !nav.contains(e.target)) {
      closeNav(true);
    }
  });

  /* 滚动联动：滚回页面顶部自动展开；向下滚动离开顶部后回到收起态 */
  function onScroll() {
    var y = scrollY();
    var atTop = y <= 6;
    var fromBelow = yPrev > 60;
    if (atTop && fromBelow) {
      openNav();
    } else if (y > 70 && y > yPrev + 2) {
      closeNav(true);
    }
    yPrev = y;
  }
  window.addEventListener('scroll', function () {
    if (!tickPending) {
      tickPending = true;
      requestAnimationFrame(function () { tickPending = false; onScroll(); });
    }
  }, { passive: true });

  /* 本地验收辅助（不影响常规浏览）：?navTest=open / closed 强制初始状态 */
  var q = /[?&]navTest=(open|closed)/.exec(location.search);
  if (q) {
    if (q[1] === 'open') { openNav(); }
    else { closeNav(true); }
  }
})();
