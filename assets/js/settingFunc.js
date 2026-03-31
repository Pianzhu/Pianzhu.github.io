/* *******************************************************
 *                  设置模块功能：绑定每个按钮                
 ******************************************************* */

//功能1：打开书签管理器
function bindOpenBookmarkModalBtn() {
    console.log("bindOpenBookmarkModalBtn");
    const btn = settingModal.querySelector('#openBookmarkModalBtn');//获取按钮的DOM元素
    if (!btn)
        {
            console.error("Can't find #openBookmarkModalBtn");
            return;
        }

    btn.onclick = () => {
        closeAllModals();

        const modal = document.getElementById('bookmarkModal');//获取书签管理器的DOM元素
        if (modal) {
            modal.style.display = 'flex';
        }
    };
}

//功能2：切换搜索结果页是否在新标签页打开
function bindToggleSearchTabBtn() {
    const btn = settingModal.querySelector('#toggleSearchTabBtn');
    if (!btn) return;

    function updateText() {
        const val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
        btn.innerText = val ? "新标签页打开" : "覆盖当前页面";
    }

    btn.onclick = () => {
        let val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
        val = !val;
        localStorage.setItem('searchNewTab', val);
        updateText();
        showTip(val ? "新标签页打开" : "覆盖当前页面", "#43a047");
    };

    updateText();
}
// 显示提示信息 
function showTip(text, color = "#222") {
    const tip = document.createElement('div');
    tip.innerText = text;
    tip.style.cssText = `
        position:fixed; top:20px; left:50%; transform:translateX(-50%);
        background:${color}; color:#fff; padding:8px 12px; border-radius:6px;
        z-index:9999; font-size:14px;
    `;
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 2600);
}

// 初始化设置功能（只管功能，不创建 UI）
function initSettingFunc() {
    bindOpenBookmarkModalBtn();
    bindToggleSearchTabBtn();
}
initSettingFunc();