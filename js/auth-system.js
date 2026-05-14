// ==================== EPhone 免登录版 ====================
(function () {
  'use strict';

  const introScreen = document.getElementById('intro-screen');
  const authScreen = document.getElementById('ephone-auth-screen');
  const phoneScreen = document.getElementById('phone-screen');

  function showMainUI() {
    if (introScreen) introScreen.style.display = 'none';
    if (authScreen) authScreen.style.display = 'none';
    if (phoneScreen) {
      phoneScreen.style.display = 'block';
      phoneScreen.classList.remove('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    showMainUI();
  });

  window.ephoneLogout = function () {
    // 免登录版不需要登出逻辑
    showMainUI();
  };

  console.log('EPhone 免登录版已启动');
})();
