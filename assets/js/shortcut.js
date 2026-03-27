// ==========================
// 📦 数据存储
// ==========================
let shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];

// ==========================
// 📦 获取DOM
// ==========================
const grid = document.getElementById('shortcutGrid');

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

// ==========================
// 📦 创建右下角设置按钮
// ==========================
const settingBtn = document.createElement('button');
settingBtn.className = 'setting-btn-float';
settingBtn.innerText = '⚙️';
document.body.appendChild(settingBtn);

// ==========================
// 📦 渲染书签
// ==========================
function render() {
    grid.innerHTML = '';
    shortcuts.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'shortcut-item';
        div.innerHTML = `
            <div class="shortcut-icon">
                <img src="https://favicon.im/zh/?url=${new URL(item.url).hostname}&size=64" />
            </div>
            <div class="shortcut-name">${item.name}</div>
            <button class="delete-btn">×</button>
        `;
        div.onclick = () => { window.open(item.url); };
        div.querySelector('.delete-btn').onclick = (e) => {
            e.stopPropagation();
            shortcuts.splice(index, 1);
            save();
            render();
        };
        grid.appendChild(div);
    });
}

// ==========================
// 📦 保存数据
// ==========================
function save() {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}

// ==========================
// 📦 弹窗通用关闭逻辑
// ==========================
function closeAllModals() {
    addModal.style.display = 'none';
    settingModal.style.display = 'none';
}

addModal.querySelector('.close-modal').onclick = closeAllModals;
addModal.addEventListener('click', (e) => {
    if (e.target === addModal) closeAllModals();
});

settingModal.querySelector('.close-modal').onclick = closeAllModals;
settingModal.addEventListener('click', (e) => {
    if (e.target === settingModal) closeAllModals();
});

// ==========================
// 📦 设置按钮
// ==========================
settingBtn.onclick = () => {
    closeAllModals();
    settingModal.style.display = 'flex';
};

settingModal.querySelector('#openAddBookmarkBtn').onclick = () => {
    settingModal.style.display = 'none';
    addModal.style.display = 'flex';
    addModal.querySelector('#siteName').value = '';
    addModal.querySelector('#siteUrl').value = '';
};

// ==========================
// 📦 添加书签
// ==========================
addModal.querySelector('#confirmAddBtn').onclick = async () => {
    let name = addModal.querySelector('#siteName').value.trim();
    let url = addModal.querySelector('#siteUrl').value.trim();

    if (!url) { alert('请输入网址'); return; }
    if (!url.startsWith('http')) url = 'https://' + url;
    if (!name) name = getAutoName(url);

    shortcuts.push({ name, url });
    save();
    render();
    closeAllModals();
    showTip("✅ 书签添加成功", "#43a047");
};

// ==========================
// 📦 导出书签
// ==========================
settingModal.querySelector('#exportBtn').onclick = () => {
    const data = JSON.stringify(shortcuts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bookmarks.json';
    a.click();
    showTip("✅ 导出成功", "#43a047");
};

// ==========================
// 📦 导入书签
// ==========================
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

// ==========================
// 📦 GitHub导入书签
// ==========================
settingModal.querySelector('#githubImportBtn').onclick = githubImport;

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

// ==========================
// 🔍 搜索打开方式 开关（仅操作本地存储）
// ==========================
const toggleSearchTabBtn = settingModal.querySelector('#toggleSearchTabBtn');
updateSearchTabText();

toggleSearchTabBtn.onclick = () => {
    // 直接读写 localStorage，不定义全局变量！
    let val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
    val = !val;
    localStorage.setItem('searchNewTab', val);
    updateSearchTabText();
    showTip(val ? "✅ 搜索：新标签页打开" : "✅ 搜索：当前页覆盖", "#43a047");
};

function updateSearchTabText() {
    let val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
    toggleSearchTabBtn.innerText = val
        ? "🔍 搜索：新标签页打开"
        : "🔍 搜索：当前页覆盖";
}

// ==========================
// 🌟 通用工具函数
// ==========================
function getAutoName(url) {
    try {
        const hostname = new URL(url).hostname.replace('www.', '').split('.')[0];
        if (/[\u4e00-\u9fa5]/.test(hostname)) return hostname.slice(0, 2);
        return hostname.slice(0, 2).toUpperCase();
    } catch {
        return '网址';
    }
}

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

// ==========================
// 🚀 初始化
// ==========================
render();