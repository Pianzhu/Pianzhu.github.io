/* *******************************************************
 *                   设置模块：UI 及弹窗                 
 ******************************************************* */
const settingModal = document.createElement('div');
settingModal.className = 'modal';
settingModal.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
        <span class="close-modal">×</span>
        <h4>设置中心</h4>
        <div class="setting-menu">
            <button id="openBookmarkModalBtn" class="setting-btn">书签相关</button>
            <button id="toggleSearchTabBtn" class="setting-btn">搜索打开方式</button>
        </div>
    </div>
`;
document.body.appendChild(settingModal);
window.settingModal = settingModal;

// ==========================
// 右下角浮动按钮
// ==========================
const settingBtn = document.createElement('button');
settingBtn.className = 'setting-btn-float';
settingBtn.innerText = '⚙️';
settingBtn.style.backgroundColor = 'white';
settingBtn.style.borderRadius = '50%';
settingBtn.style.fontSize = '18px';
settingBtn.style.width = '40px';
settingBtn.style.height = '40px';
settingBtn.style.cursor = 'pointer';
document.body.appendChild(settingBtn);

// ==========================
// 弹窗关闭功能（所有弹窗通用）
// ==========================
function closeAllModals() {
    if (window.settingModal) settingModal.style.display = 'none';
    if (window.bookmarkModal) bookmarkModal.style.display = 'none';
    if (window.addModal) addModal.style.display = 'none';
}

// 点击 X 或外部区域关闭
function bindModalClose(modal) {
    modal.querySelector('.close-modal')?.addEventListener('click', closeAllModals);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
    });
}

// 初始化设置模块（只管 UI）
function initSettingUI() {
    bindModalClose(settingModal);
    settingBtn.onclick = () => {
        closeAllModals();
        settingModal.style.display = 'flex';
    };
}
initSettingUI();