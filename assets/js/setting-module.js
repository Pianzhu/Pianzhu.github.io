// ==========================
// ⚙️ 设置模块 - 独立分离
// 功能：设置弹窗、添加弹窗、悬浮按钮、导入导出、GitHub同步、打开方式配置
// ==========================

// ==========================
// 📦 创建【添加书签】弹窗
// ==========================
const addModal = document.createElement('div');
addModal.className = 'modal';
addModal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">×</span>
        <h4>添加快捷网址</h4>
        <div class="modal-form">
            <label>网站名称：</label>
            <input type="text" id="siteName" placeholder="百度">
            <label>网站地址：</label>
            <input type="url" id="siteUrl" placeholder="如：https://www.baidu.com">
            <button id="confirmAddBtn" class="confirm-btn">确认添加</button>
        </div>
    </div>
`;
document.body.appendChild(addModal);
window.addModal = addModal; // 挂载到全局

// ==========================
// 📦 创建【设置】弹窗
// ==========================
const settingModal = document.createElement('div');
settingModal.className = 'modal';
settingModal.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
        <span class="close-modal">×</span>
        <h4>设置中心</h4>
        <div class="setting-menu">
            <button id="openAddBookmarkBtn" class="setting-btn">添加书签</button>
            <button id="importBtn" class="setting-btn">导入书签</button>
            <button id="exportBtn" class="setting-btn">导出书签</button>
            <button id="githubImportBtn" class="setting-btn">GitHub导入书签</button>
            <button id="toggleSearchTabBtn" class="setting-btn">新标签页打开</button>
        </div>
    </div>
`;
document.body.appendChild(settingModal);
window.settingModal = settingModal; // 挂载到全局

// ==========================
// 📦 创建右下角设置按钮
// ==========================
const settingBtn = document.createElement('button');
settingBtn.className = 'setting-btn-float';
settingBtn.innerText = '⚙️';
document.body.appendChild(settingBtn);

// ==========================
// 🔗 绑定弹窗关闭事件
// ==========================
function bindModalClose() {
    [addModal, settingModal].forEach(modal => {
        modal.querySelector('.close-modal').onclick = closeAllModals;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAllModals();
        });
    });
}

// ==========================
// 🔗 绑定设置按钮事件
// ==========================
function bindSettingBtn() {
    // 主设置按钮
    settingBtn.onclick = () => {
        closeAllModals();
        settingModal.style.display = 'flex';
    };

    // 设置内打开添加书签
    settingModal.querySelector('#openAddBookmarkBtn').onclick = () => {
        settingModal.style.display = 'none';
        addModal.style.display = 'flex';
        addModal.querySelector('#siteName').value = '';
        addModal.querySelector('#siteUrl').value = '';
    };
}

// ==========================
// 📤 导出书签
// ==========================
function bindExport() {
    settingModal.querySelector('#exportBtn').onclick = () => {
        const data = JSON.stringify(shortcuts, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'bookmarks.json';
        a.click();
        showTip("✅ 导出成功", "#43a047");
    };
}

// ==========================
// 📥 导入书签
// ==========================
function bindImport() {
    settingModal.querySelector('#importBtn').onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    if (Array.isArray(data)) {
                        shortcuts = data;
                        save();
                        render();
                        showTip("✅ 导入成功", "#43a047");
                    }
                } catch {
                    showTip("❌ 文件格式错误", "#e53935");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };
}

// ==========================
// 🐙 GitHub 云端导入
// ==========================
async function githubImport() {
    const isLocal = window.location.protocol === 'file:';
    if (isLocal) {
        showTip("⚠️ 本地无法拉取云端书签", "#ff9800");
        return;
    }

    showTip("🔄 正在从 GitHub 拉取书签...");

    try {
        const res = await fetch('./bookmarks.json');
        if (!res.ok) throw new Error("请求失败");

        const cloudData = await res.json();
        if (!Array.isArray(cloudData)) {
            showTip("❌ 云端书签格式错误", "#e53935");
            return;
        }

        const totalCloud = cloudData.length;
        const localUrls = new Set(shortcuts.map(i => i.url));
        let repeatCount = 0;
        let newCount = 0;

        cloudData.forEach(item => {
            if (!item.url) return;
            if (localUrls.has(item.url)) {
                repeatCount++;
            } else {
                shortcuts.push(item);
                newCount++;
                localUrls.add(item.url);
            }
        });

        save();
        render();

        if (newCount > 0) {
            showTip(`✅ 找到 ${totalCloud} 个｜重复 ${repeatCount} 个｜新增 ${newCount} 个`, "#43a047");
        } else {
            showTip(`✅ 找到 ${totalCloud} 个｜全部重复，无需更新`, "#0288d1");
        }

    } catch (err) {
        showTip("❌ 拉取失败，请检查网络或云端文件", "#e53935");
    }
}

function bindGithubImport() {
    settingModal.querySelector('#githubImportBtn').onclick = githubImport;
}

// ==========================
// 🔍 搜索打开方式 配置项
// ==========================
const toggleSearchTabBtn = settingModal.querySelector('#toggleSearchTabBtn');

function updateSearchTabText() {
    let val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
    toggleSearchTabBtn.innerText = val
        ? "🔍 搜索：新标签页打开"
        : "🔍 搜索：当前页覆盖";
}

function bindSearchTabToggle() {
    toggleSearchTabBtn.onclick = () => {
        let val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
        val = !val;
        localStorage.setItem('searchNewTab', val);
        updateSearchTabText();
        showTip(val ? "✅ 搜索：新标签页打开" : "✅ 搜索：当前页覆盖", "#43a047");
    };
    updateSearchTabText();
}

// ==========================
// 🚀 设置模块初始化
// ==========================
function initSettingModule() {
    bindModalClose();       // 关闭事件
    bindSettingBtn();       // 设置按钮
    bindAddModalEvent();    // 添加书签（来自主文件）
    bindExport();           // 导出
    bindImport();           // 导入
    bindGithubImport();     // GitHub同步
    bindSearchTabToggle();  // 打开方式配置
}

// 启动设置模块
initSettingModule();