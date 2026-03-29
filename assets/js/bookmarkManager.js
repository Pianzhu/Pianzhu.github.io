// ==========================
// 功能1：书签管理弹窗：添加、导入、导出、GitHub 导入
// ==========================
const bookmarkModal = document.createElement('div');
bookmarkModal.className = 'modal';
bookmarkModal.id = 'bookmarkModal'; 
bookmarkModal.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
        <span class="close-modal">×</span>
        <h4>书签管理</h4>
        <div class="setting-menu">
            <button id="openAddBookmarkBtn" class="setting-btn">添加书签</button>
            <button id="importBtn" class="setting-btn">导入书签</button>
            <button id="exportBtn" class="setting-btn">导出书签</button>
            <button id="githubImportBtn" class="setting-btn">GitHub 云端导入</button>
        </div>
    </div>
`;
document.body.appendChild(bookmarkModal);
window.bookmarkModal = bookmarkModal;
// ==========================
// 功能1.1：添加书签弹窗
// ==========================
function initAddBookmarkModal()  {
    // 创建弹窗
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
                <input type="url" id="siteUrl" placeholder="https://www.baidu.com">
                <button id="confirmAddBtn" class="confirm-btn">确认添加</button>
            </div>
        </div>
    `;
    document.body.appendChild(addModal);

    //获取需要的元素
    const bookmarkModal = document.getElementById('bookmarkModal');
    const openBtn = document.getElementById('openAddBookmarkBtn');
    const siteNameInput = addModal.querySelector('#siteName');
    const siteUrlInput = addModal.querySelector('#siteUrl');
    const closeBtn = addModal.querySelector('.close-modal');

    //安全判断
    if (!openBtn || !bookmarkModal) return;

    //打开弹窗
    openBtn.addEventListener('click', () => {
        bookmarkModal.style.display = 'none';
        addModal.style.display = 'flex';

        // 清空输入框
        siteNameInput.value = '';
        siteUrlInput.value = '';
    });

    //关闭弹窗
    closeBtn.addEventListener('click', () => {
        addModal.style.display = 'none';
        bookmarkModal.style.display = 'flex';
    });
}

// ==========================
// 页面加载后初始化
// ==========================
document.addEventListener('DOMContentLoaded', initAddBookmarkModal);


// ==========================
// 功能1.2：导入书签
// ==========================
function bindImport() {
    bookmarkModal.querySelector('#importBtn').onclick = () => {
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
                        showTip("导入成功", "#43a047");
                    }
                } catch {
                    showTip("文件格式错误", "#e53935");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };
}

// ==========================
// 功能1.3：导出书签
// ==========================
function bindExport() {
    bookmarkModal.querySelector('#exportBtn').onclick = () => {
        const data = JSON.stringify(shortcuts, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'bookmarks.json';
        a.click();
        showTip("导出成功", "#43a047");
    };
}

// ==========================
// 功能1.4：GitHub 导入
// ==========================
async function githubImport() {
    const isLocal = window.location.protocol === 'file:';
    if (isLocal) {
        showTip("本地无法拉取云端书签", "#ff9800");
        return;
    }
    showTip("正在从 GitHub 拉取...");
    try {
        const res = await fetch('./bookmarks.json');
        if (!res.ok) throw new Error("请求失败");
        const cloudData = await res.json();
        if (!Array.isArray(cloudData)) {
            showTip("云端格式错误", "#e53935");
            return;
        }
        const localUrls = new Set(shortcuts.map(i => i.url));
        let repeat = 0, add = 0;
        cloudData.forEach(item => {
            if (!item.url) return;
            if (localUrls.has(item.url)) repeat++;
            else { shortcuts.push(item); add++; localUrls.add(item.url); }
        });
        save(); render();
        if (add > 0) showTip(`新增 ${add} 个｜重复 ${repeat} 个`, "#43a047");
        else showTip(`全部重复，无需更新`, "#0288d1");
    } catch {
        showTip("拉取失败", "#e53935");
    }
}

function bindGithubImport() {
    bookmarkModal.querySelector('#githubImportBtn').onclick = githubImport;
}

// ==========================
// 初始化书签模块
// ==========================
function initBookmarkModule() {
    bindImport();
    bindExport();
    bindGithubImport();
}

function initBookmarkSystem() {
    initAddBookmarkModal();     // 添加书签弹窗
    initBookmarkModule();       // 导入导出等
    bindOpenBookmarkModalBtn(); // 功能1：打开书签管理器
}

document.addEventListener('DOMContentLoaded', initBookmarkSystem);