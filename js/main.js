/* =========================================================
   尚闯 · 个人主页交互脚本
   1. 导航栏滚动状态：下滑后切换为浅色毛玻璃
   2. 滚动淡入：.reveal 元素进入视口时加上 .visible
   3. 导航高亮：当前浏览到哪个区块，对应链接高亮
   ========================================================= */
(function () {
  'use strict';

  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a');

  /* ---------- 1. 导航栏滚动状态 ---------- */
  function updateNav() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 32);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---------- 2. 滚动淡入 ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  function showEl(el) {
    el.classList.add('visible');
    // 动画结束后清除延迟，避免影响卡片 hover 的响应速度
    const clear = () => {
      el.style.transitionDelay = '';
      el.removeEventListener('transitionend', clear);
    };
    el.addEventListener('transitionend', clear);
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            io.unobserve(entry.target); // 只播一次
            showEl(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    revealEls.forEach((el) => {
      // HTML 里的 data-delay 用来做同一排元素的错峰出现
      if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 'ms';
      io.observe(el);
    });
  } else {
    // 老浏览器兜底：直接全部显示
    revealEls.forEach(showEl);
  }

  /* ---------- 3. 导航链接高亮 ---------- */
  const sections = document.querySelectorAll('main section[id]');

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => sectionIO.observe(s));
  }
})();
