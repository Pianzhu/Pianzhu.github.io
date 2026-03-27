// 等待DOM加载完成后执行，避免获取不到元素
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    // 检查元素是否存在，避免报错
    if (!searchInput || !searchBtn) {
        console.warn("未找到搜索输入框或按钮，请检查ID是否正确");
        return;
    }

    // 绑定点击事件
    searchBtn.addEventListener('click', doSearch);
    // 新增：按回车键触发搜索（提升用户体验）
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 阻止回车默认行为（如表单提交）
            doSearch();
        }
    });

    // 搜索核心函数
    function doSearch() {
        const searchText = searchInput.value.trim();
        const encodedText = encodeURIComponent(searchText);
        // 拼接必应搜索URL
        let searchUrl = "https://www.bing.com/search?q=";
        if (searchText) { // 简化非空判断
            searchUrl += encodedText;
        }
        // 打开新标签页（添加noopener提升安全性）
        window.open(searchUrl, "_blank", "noopener");
    }
});