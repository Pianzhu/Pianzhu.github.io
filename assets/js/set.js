// ==========================
// 设置
// ==========================
const settingBtn = document.createElement('button');
settingBtn.className = 'setting-btn-float';
settingBtn.innerText = '⚙️';
document.body.appendChild(settingBtn);

// 2. 创建设置弹窗
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
document.body.appendChild(settingModal);//创建设置弹窗
// ==========================
// 绑定按钮功能
// ==========================
window.openBookmarkModalBtn = settingModal.querySelector('#openBookmarkModalBtn');// 书签管理按钮功能绑定
window.toggleSearchTabBtn = settingModal.querySelector('#toggleSearchTabBtn');// 搜索打开方式按钮功能绑定

// 3. 打开弹窗
settingBtn.onclick = () => {
    settingModal.style.display = 'flex';
};

// 4. 关闭按钮
settingModal.querySelector('.close-modal').onclick = () => {
    settingModal.style.display = 'none';
};

// 5. 点击空白处关闭
settingModal.onclick = (e) => {
    if (e.target === settingModal) settingModal.style.display = 'none';
};

// 全局挂载
window.settingModal = settingModal;
window.settingBtn = settingBtn;

// ==========================
// 关闭所有弹窗
// ==========================
function closeAllModals() {
    if (window.settingModal) settingModal.style.display = 'none';
    if (window.bookmarkModal) bookmarkModal.style.display = 'none';
    if (window.addModal) addModal.style.display = 'none';
}
window.closeAllModals = closeAllModals;

// ==========================
// 弹窗关闭事件
// ==========================
function bindModalClose() {
    const modals = [];
    if (window.settingModal) modals.push(settingModal);
    if (window.bookmarkModal) modals.push(bookmarkModal);
    if (window.addModal) modals.push(addModal);

    modals.forEach(modal => {
        modal.querySelector('.close-modal').onclick = closeAllModals;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAllModals();
        });
    });
}

// ==========================
// 初始化
// ==========================
function initSettingModule() {
    bindModalClose();
}

initSettingModule();