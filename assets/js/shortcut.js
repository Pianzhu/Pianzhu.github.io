// ==========================
// 书签核心
// ==========================

// ==========================
// 数据存储（核心）
// ==========================
let shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];

// ==========================
// 获取DOM
// ==========================
const grid = document.getElementById('shortcutGrid');

// ==========================
// 渲染书签
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
// 保存数据
// ==========================
function save() {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}

// ==========================
// 弹窗通用关闭（全局方法）
// ==========================
function closeAllModals() {
    if (window.addModal) window.addModal.style.display = 'none';
    if (window.settingModal) window.settingModal.style.display = 'none';
    if (window.bookmarkModal) window.bookmarkModal.style.display = 'none';
}

// ==========================
// 添加书签弹窗（核心逻辑）
// ==========================
function bindAddModalEvent() {
    const addModal = window.addModal;
    addModal.querySelector('#confirmAddBtn').onclick = () => {
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
}

// ==========================
// 通用工具函数
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
// 初始化
// ==========================
render();