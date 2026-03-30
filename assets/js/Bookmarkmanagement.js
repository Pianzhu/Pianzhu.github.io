// ==========================
// 1. 书签管理主弹窗
// 功能：提供添加/导入/导出/GitHub同步入口
// ==========================
let shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];// 读取本地存储的书签数据
const grid = document.getElementById('shortcutGrid');// 书签列表容器
const bookmarkManagerModal = document.createElement('div');
bookmarkManagerModal.className = 'modal';
bookmarkManagerModal.innerHTML = `
  <!-- 书签管理弹窗内容区 -->
  <div class="modal-content" style="max-width: 400px;">
    <span class="close-modal">×</span>
    <h4>书签管理</h4>
    <div class="setting-menu">
      <button id="openAddBookmarkBtn" class="setting-btn">添加书签</button>
      <button id="importBookmarkBtn" class="setting-btn">导入书签</button>
      <button id="exportBookmarkBtn" class="setting-btn">导出书签</button>
      <button id="githubImportBookmarkBtn" class="setting-btn">GitHub 云端导入</button>
    </div>
  </div>
`;
document.body.appendChild(bookmarkManagerModal);// 追加到 body 元素末尾
window.bookmarkManagerModal = bookmarkManagerModal;// 全局变量
setupModalClose(bookmarkManagerModal);
openBookmarkModalBtn.onclick = () => {
    // 关闭设置弹窗
    settingModal.style.display = 'none';
    // 打开书签管理弹窗
    bookmarkManagerModal.style.display = 'flex';
};
const openAddBookmarkBtn = bookmarkManagerModal.querySelector('#openAddBookmarkBtn');
const importBookmarkBtn = bookmarkManagerModal.querySelector('#importBookmarkBtn');
const exportBookmarkBtn = bookmarkManagerModal.querySelector('#exportBookmarkBtn');
const githubImportBookmarkBtn = bookmarkManagerModal.querySelector('#githubImportBookmarkBtn');


// 万能关闭弹窗函数（给任何弹窗用）
function setupModalClose(modal) {
    if (!modal) return;

    // 点右上角 × 关闭
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }

    // 点击弹窗外部灰色区域关闭
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}
// ==========================
// 打开【添加书签】弹窗
// ==========================
openAddBookmarkBtn.onclick = () => {
    // 1. 先判断：弹窗是否已创建，避免重复生成
    let addBookmarkModal = document.querySelector('.add-bookmark-modal');

    if (!addBookmarkModal) {
        // 创建弹窗容器
        addBookmarkModal = document.createElement('div');
        // 加专属类名，方便查找
        addBookmarkModal.className = 'modal add-bookmark-modal';
        addBookmarkModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">×</span>
                <h4>添加快捷网址</h4>
                <div class="bookmark-form">
                    <label>网站名称：</label>
                    <input type="text" id="siteName" placeholder="百度">
                    <label>网站地址：</label>
                    <input type="url" id="siteUrl" placeholder="https://www.baidu.com">
                    <button id="confirmAddBookmarkBtn" class="confirm-btn">确认添加</button>
                </div>
            </div>
        `;
        document.body.appendChild(addBookmarkModal);
        setupModalClose(addBookmarkModal);
    }

    // 2. 再绑定打开按钮事件（顺序正确！）
    const openBtn = bookmarkManagerModal.querySelector('#openAddBookmarkBtn');
    openBtn.onclick = () => {
        // 隐藏管理弹窗
        bookmarkManagerModal.style.display = 'none';
        // 显示添加弹窗
        addBookmarkModal.style.display = 'flex';
        // 清空输入框
        addBookmarkModal.querySelector('#siteName').value = '';
        addBookmarkModal.querySelector('#siteUrl').value = '';
    };
    window.addBookmarkModal = addBookmarkModal;
    console.log(window.addBookmarkModal);
    // 3. 绑定确认按钮事件
    const confirmBtn = addBookmarkModal.querySelector('#confirmAddBookmarkBtn');
    confirmBtn.onclick = () => {
        let name = addBookmarkModal.querySelector('#siteName').value.trim();
        let url = addBookmarkModal.querySelector('#siteUrl').value.trim();

        if (!url) { alert('请输入网址'); return; }
        if (!url.startsWith('http')) url = 'https://' + url;
        if (!name) name = getAutoName(url);
        shortcuts.push({ name, url });
        localStorage.setItem('shortcuts', JSON.stringify(shortcuts));// 保存书签数据到本地存储
        render();
        showTip("✅ 书签添加成功", "#43a047");
    }
}
// ==========================
// 导入书签
// ==========================
importBookmarkBtn.onclick = () => {
    bookmarkManagerModal.querySelector('#importBookmarkBtn').onclick = () => {
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
// 导出书签
// ==========================
exportBookmarkBtn.onclick = () => {
    bookmarkManagerModal.querySelector('#exportBookmarkBtn').onclick = () => {
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
// GitHub 云端导入
// ==========================
githubImportBookmarkBtn.onclick = async () => {
    const isLocal = window.location.protocol === 'file:';
    if (isLocal)
        return showTip("本地无法拉取云端书签（file:// 协议限制）", "#ff9800");

    showTip("正在从 GitHub 拉取...");
    try {
        const res = await fetch('./bookmarks.json');

        // HTTP 状态码错误（404/500等）
        if (!res.ok)
            throw new Error(`HTTP 错误 ${res.status}：文件不存在或服务器异常`);

        const cloudData = await res.json();

        if (!Array.isArray(cloudData))
            throw new Error("云端数据格式错误：不是数组");

        // ===================== 新增控制台输出 =====================
        console.log(`云端书签拉取完成，共识别到 ${cloudData.length} 个书签`);
        console.log('云端书签列表：');
        
        cloudData.forEach((item, index) => {
            if (item.url) {
                console.log(`  ${index + 1}. ${item.name || '未命名'} → ${item.url}`);
            }
        });
        // ==========================================================

        const localUrls = new Set(shortcuts.map(i => i.url));
        let repeat = 0, add = 0;

        cloudData.forEach(item => {
            if (!item.url) return;
            if (localUrls.has(item.url)) repeat++;
            else {
                shortcuts.push(item);
                add++;
                localUrls.add(item.url);
            }
        });

        localStorage.setItem('shortcuts', JSON.stringify(shortcuts));// 保存书签数据到本地存储
        render();
        showTip(`新增 ${add} 个｜重复 ${repeat} 个`, "#43a047");

        // ===================== 新增结果日志 =====================
        console.log(`\n导入完成：新增 ${add} 个 | 重复 ${repeat} 个`);
        // ========================================================

    } catch (err) {
        // 这里会显示真实失败原因！
        const errMsg = err.message || "未知错误";
        showTip(`拉取失败：${errMsg}`, "#e53935");
        console.error("拉取书签详细错误：", err); // 控制台也会打印
    }
};
// ==========================
// 渲染书签
// ==========================
function render() {
    grid.innerHTML = '';
    shortcuts.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'shortcut-item';

        // 提前获取自动生成的名称（2个字符）
        const autoText = getAutoName(item.url);

        div.innerHTML = `
            <div class="shortcut-icon">
                <!-- 图标 -->
                <img 
                    src="https://favicon.im/zh/?url=${new URL(item.url).hostname}&size=64" 
                    alt="${item.name}"
                    onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                />
                <!-- 图标加载失败时显示：自动生成的2个字符 -->
                <div class="icon-fallback" style="display:none;">
                    ${autoText}
                </div>
            </div>
            <div class="shortcut-name">${item.name}</div>
            <button class="delete-btn">×</button>
        `;

        // 点击打开网址
        div.onclick = () => { window.open(item.url); };

        // 删除按钮
        div.querySelector('.delete-btn').onclick = (e) => {
            e.stopPropagation();
            shortcuts.splice(index, 1);
            localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
            render();
        };

        grid.appendChild(div);
    });
}
//自动获取名字
function getAutoName(url) {
    try {
        const hostname = new URL(url).hostname.replace('www.', '').split('.')[0];
        if (/[\u4e00-\u9fa5]/.test(hostname)) return hostname.slice(0, 2);
        return hostname.slice(0, 2).toUpperCase();
    } catch {
        return '网址';
    }
}
//提示框
let tipTimer = null; // 全局只加这一句

function showTip(text, color = "#2196F3") {
    const tip = document.getElementById("tip") || document.createElement("div");
    tip.id = "tip";

    // 关键：每次显示前先清除上一个定时器
    if (tipTimer) clearTimeout(tipTimer);

    tip.textContent = text;
    tip.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${color};
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 9999;
    opacity: 0.95;
  `;

    if (!tip.parentNode) document.body.appendChild(tip);

    // 2秒后消失
    tipTimer = setTimeout(() => {
        tip.remove();
        tipTimer = null;
    }, 2000);
}
render();



// ==========================
// 初始化所有书签功能
// ==========================
render();