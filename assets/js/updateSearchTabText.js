// ==========================
// 搜索打开方式
// ==========================
toggleSearchTabBtn.onclick = () => {
    let val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
    val = !val;
    localStorage.setItem('searchNewTab', val);
    updateSearchTabText();
    showTip(val ? "新标签页打开" : "覆盖当前页面", "#43a047");
};
updateSearchTabText();
function updateSearchTabText() {
    let val = JSON.parse(localStorage.getItem('searchNewTab')) ?? true;
    toggleSearchTabBtn.innerText = val
        ? "新标签页打开"
        : "覆盖当前页面";
}