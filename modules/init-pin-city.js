// ============================================================
// init-pin-city.js
// PIN 激活逻辑、城市搜索、更新检查
// 从 init-and-state.js 拆分
// ============================================================
localStorage.setItem('ephonePinActivated', 'true');
document.addEventListener('DOMContentLoaded', () => {

  async function searchCityGeo(cityName) {
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=zh&format=json`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
      return null;
    } catch (e) {
      console.error("城市搜索失败:", e);
      return null;
    }
  }

  document.getElementById('user-city-search-btn').addEventListener('click', async () => {
    const query = document.getElementById('user-real-city-search').value.trim();
    if (!query) return alert("请输入真实城市拼音或英文名称");

    const result = await searchCityGeo(query);
    if (result) {
      document.getElementById('user-city-lat').value = result.latitude;
      document.getElementById('user-city-lon').value = result.longitude;
      document.getElementById('user-city-result').textContent = `已选中: ${result.name}, ${result.country} (${result.latitude}, ${result.longitude})`;
      document.getElementById('user-city-result').style.color = 'green';
      // 可以在 dataset 暂存真实城市名
      document.getElementById('user-real-city-search').dataset.realName = result.name;
    } else {
      alert("未找到该城市，请尝试使用拼音或英文 (如 Shanghai)。");
    }
  });

  document.getElementById('char-city-search-btn').addEventListener('click', async () => {
    const query = document.getElementById('char-real-city-search').value.trim();
    if (!query) return alert("请输入真实城市拼音或英文名称");

    const result = await searchCityGeo(query);
    if (result) {
      document.getElementById('char-city-lat').value = result.latitude;
      document.getElementById('char-city-lon').value = result.longitude;
      document.getElementById('char-city-result').textContent = `已选中: ${result.name}, ${result.country} (${result.latitude}, ${result.longitude})`;
      document.getElementById('char-city-result').style.color = 'green';
      document.getElementById('char-real-city-search').dataset.realName = result.name;
    } else {
      alert("未找到该城市，请尝试使用拼音或英文 (如 New York)。");
    }
  });

  // 手动总结弹窗事件监听器
  document.getElementById('manual-summary-btn').addEventListener('click', () => window.openManualSummaryModal());
  document.getElementById('manual-summary-close-btn').addEventListener('click', () => window.closeManualSummaryModal());
  document.getElementById('manual-summary-cancel-btn').addEventListener('click', () => window.closeManualSummaryModal());
  document.getElementById('manual-summary-confirm-btn').addEventListener('click', () => window.executeManualSummary());

  // 暂停调用按钮事件监听器
  const stopApiCallBtn = document.getElementById('stop-api-call-btn');
  if (stopApiCallBtn) {
    stopApiCallBtn.addEventListener('click', () => {
      if (currentApiController) {
        console.log('用户点击暂停调用按钮，正在取消API请求...');
        currentApiController.abort();

        // 立即隐藏按钮并移除动画
        stopApiCallBtn.style.display = 'none';
        stopApiCallBtn.classList.remove('active');

        // 显示取消提示（仅给用户看，不会进入聊天历史）
        showCustomAlert('已停止', '对话已停止生成');
      }
    });
  }

  const PREFILLED_SALT = "bu_wan_jiu_guan_bu_yao_huo_qu";


  async function generatePin(deviceId, salt) {
    if (!deviceId || !salt) {
      throw new Error("设备ID和密钥盐不能为空。");
    }
    const dataToHash = deviceId + salt;
    const dataBuffer = new TextEncoder().encode(dataToHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 6).toUpperCase();
  }


  function requirePinActivation() {
    return Promise.resolve(true);
}
window.requirePinActivation = requirePinActivation;

  window.requirePinActivation = requirePinActivation;

  function updateLockedFeatureUI() {
    const isActivated = localStorage.getItem('ephonePinActivated') === 'true';
    const presetImportBtn = document.getElementById('import-preset-btn');


    const worldBookImportBtn = document.getElementById('import-world-book-btn');



    if (presetImportBtn) {
      presetImportBtn.classList.toggle('locked-feature', !isActivated);
    }


    if (worldBookImportBtn) {
      worldBookImportBtn.classList.toggle('locked-feature', !isActivated);
    }

  }

  window.updateLockedFeatureUI = updateLockedFeatureUI;

  document.addEventListener('visibilitychange', () => {

    if (document.visibilityState === 'visible') {
      console.log('应用已返回前台，正在检查更新...');

      navigator.serviceWorker.ready.then(registration => {

        registration.update();
      });
    }
  });

});
