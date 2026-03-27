// ==========================
// 📦 数据存储
// ==========================
let shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];

// ==========================
// 📦 获取DOM
// ==========================
const grid = document.getElementById('shortcutGrid');

// ==========================
// 📦 创建弹窗（按钮同一行）
// ==========================
const modal = document.createElement('div');
modal.className = 'modal';

modal.innerHTML = `
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

        <!-- 全部4个按钮在同一行！-->
        <div class="modal-import-export" style="display:flex;gap:8px;margin-top:10px;">
            <button id="importBtn" style="flex:1;">导入书签</button>
            <button id="exportBtn" style="flex:1;">导出书签</button>
            <button id="githubImport" style="flex:1;">GitHub导入</button>
        </div>
    </div>
`;

document.body.appendChild(modal);

// ==========================
// 📦 创建右下角添加按钮
// ==========================
const addBtn = document.createElement('button');
addBtn.className = 'add-btn';
addBtn.innerText = '+';
document.body.appendChild(addBtn);

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
// 📦 打开弹窗
// ==========================
addBtn.onclick = () => {
    modal.style.display = 'flex';
};

// ==========================
// 📦 关闭弹窗
// ==========================
modal.querySelector('.close-modal').onclick = () => {
    modal.style.display = 'none';
};

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// ==========================
// 📦 添加书签
// ==========================
modal.querySelector('#confirmAddBtn').onclick = async () => {
    let name = modal.querySelector('#siteName').value.trim();
    let url = modal.querySelector('#siteUrl').value.trim();

    if (!url) { alert('请输入网址'); return; }
    if (!url.startsWith('http')) url = 'https://' + url;
    if (!name) name = getAutoName(url);

    shortcuts.push({ name, url });
    save();
    render();
    modal.querySelector('#siteName').value = '';
    modal.querySelector('#siteUrl').value = '';
    modal.style.display = 'none';
};

// ==========================
// 📦 导出书签
// ==========================
modal.querySelector('#exportBtn').onclick = () => {
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
modal.querySelector('#importBtn').onclick = () => {
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
// 🌟 通用顶部提示
// ==========================
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
// 🌟 从 GitHub 导入（自动拉取）
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

        // ==========================================
        // 完整统计逻辑
        // ==========================================
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

        // ==========================================
        // 最终清晰提示
        // ==========================================
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
// 自动名称
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

// ==========================
// 绑定按钮
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('githubImport').onclick = githubImport;
});

// ==========================
// 🚀 初始化
// ==========================
render();