/**
 * GamePulse 设备自动检测 & 重定向
 * ─────────────────────────────────
 * 功能：
 *   1. 自动检测终端类型（手机 / 平板 / PC）
 *   2. 首次访问时自动跳转到对应版本
 *   3. 用户手动切换后记住偏好（localStorage）
 *   4. 提供全局 API：GamePulse.device
 */
(function () {
  'use strict';

  // ── 1. 设备检测 ──────────────────────────────────────────
  var ua = navigator.userAgent || '';
  var w = window.innerWidth || screen.width;

  // 手机：UA 含移动关键词 或 宽度 ≤ 768
  var isMobile = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  // 平板：iPad / Android 平板 / 宽度 769~1024
  var isTablet = /iPad|tablet/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
    (w > 768 && w <= 1024 && ('ontouchstart' in window));
  // PC：其余
  var isPC = !isMobile && !isTablet;

  var deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'pc';

  // ── 2. 当前页面判断 ─────────────────────────────────────
  var path = window.location.pathname;
  var isOnMobilePage = /mobile\.html/i.test(path);
  var isOnPCPage = !isOnMobilePage; // index.html 或根路径

  // ── 3. 用户偏好（手动切换后记住） ──────────────────────
  var PREF_KEY = 'gp_ui_pref'; // 值: 'mobile' | 'pc' | null
  var userPref = null;
  try { userPref = localStorage.getItem(PREF_KEY); } catch (e) {}

  // ── 4. 自动重定向逻辑 ──────────────────────────────────
  // 规则：
  //   - 如果用户手动切换过 → 遵守偏好，不再自动跳
  //   - 如果没有偏好 → 根据设备类型自动跳
  //     * 手机 → mobile.html
  //     * 平板 → mobile.html（移动端更适合触屏）
  //     * PC   → index.html
  var shouldBeMobile = (deviceType === 'mobile' || deviceType === 'tablet');

  if (!userPref) {
    // 无偏好 → 自动检测跳转
    if (shouldBeMobile && isOnPCPage) {
      window.location.replace('mobile.html');
      return;
    }
    if (!shouldBeMobile && isOnMobilePage) {
      window.location.replace('index.html');
      return;
    }
  } else {
    // 有偏好 → 遵守偏好
    if (userPref === 'mobile' && isOnPCPage) {
      window.location.replace('mobile.html');
      return;
    }
    if (userPref === 'pc' && isOnMobilePage) {
      window.location.replace('index.html');
      return;
    }
  }

  // ── 5. 切换按钮点击时记录偏好 ──────────────────────────
  function setPreference(pref) {
    try { localStorage.setItem(PREF_KEY, pref); } catch (e) {}
  }

  // 监听切换按钮（PC页面上的"移动版"按钮 和 移动页面上的"PC版"按钮）
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-switch-to]');
    if (!link) return;
    var target = link.getAttribute('data-switch-to');
    if (target === 'mobile' || target === 'pc') {
      setPreference(target);
    }
  });

  // ── 6. 暴露全局 API ───────────────────────────────────
  window.GamePulse = window.GamePulse || {};
  window.GamePulse.device = {
    type: deviceType,        // 'mobile' | 'tablet' | 'pc'
    isMobile: isMobile,
    isTablet: isTablet,
    isPC: isPC,
    userPref: userPref,
    clearPref: function () {
      try { localStorage.removeItem(PREF_KEY); } catch (e) {}
    },
    setPref: setPreference
  };
})();
