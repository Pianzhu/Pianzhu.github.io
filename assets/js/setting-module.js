// ==========================
// 设置核心
// ==========================

// ==========================
// 创建【设置中心】弹窗
// ==========================
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
// 创建右下角设置按钮
// ==========================
const settingBtn = document.createElement('button');
settingBtn.className = 'setting-btn-float';
settingBtn.innerText = '⚙️';
// 正确写法：用 style 设置样式
settingBtn.style.backgroundColor = 'white'; // 背景白色
settingBtn.style.borderRadius = '50%'; // 圆形
settingBtn.style.fontSize = '18px';
settingBtn.style.width = '40px';
settingBtn.style.height = '40px';
settingBtn.style.cursor = 'pointer';
document.body.appendChild(settingBtn);

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
// 设置按钮事件
// ==========================
function bindSettingBtn() {
    settingBtn.onclick = () => {
        closeAllModals();
        settingModal.style.display = 'flex';
    };

    // 打开书签管理弹窗
    settingModal.querySelector('#openBookmarkModalBtn').onclick = () => {
        settingModal.style.display = 'none';
        window.bookmarkModal.style.display = 'flex';
    };
}

// ==========================
// 搜索打开方式
// ==========================
const toggleSearchTabBtn = settingModal.querySelector('#toggleSearchTabBtn');

function updateSearchTabText() {
    let val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
    toggleSearchTabBtn.innerText = val
        ? "新标签页打开"
        : "覆盖当前页面";
}

function bindSearchTabToggle() {
    toggleSearchTabBtn.onclick = () => {
        let val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
        val = !val;
        localStorage.setItem('searchNewTab', val);
        updateSearchTabText();
        showTip(val ? "新标签页打开" : "覆盖当前页面", "#43a047");
    };
    updateSearchTabText();
}

// ==========================
// 初始化
// ==========================
function initSettingModule() {
    bindModalClose();
    bindSettingBtn();
    bindSearchTabToggle();
}

initSettingModule();