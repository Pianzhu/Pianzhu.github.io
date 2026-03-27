// 搜索模块：只读取 localStorage，不冲突
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    if (!searchInput || !searchBtn) {
        console.warn("未找到搜索框");
        return;
    }

    // 绑定事件
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            doSearch();
        }
    });

    // 搜索函数
    function doSearch() {
        const text = searchInput.value.trim();
        if (!text) return;

        // 实时读取设置
        const searchNewTab = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
        const url = "https://www.bing.com/search?q=" + encodeURIComponent(text);

        if (searchNewTab) {
            window.open(url, '_blank');
        } else {
            location.href = url;
        }
        searchInput.value = "";
    }
});