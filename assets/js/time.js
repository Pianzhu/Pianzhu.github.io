// ==========================
// 时间显示（核心）
// ==========================
// 时间显示核心逻辑（修复时区问题，统一显示北京时间）
document.addEventListener('DOMContentLoaded', () => {
    const timeShowEl = document.querySelector('.time-show');
    
    // 初始化时间显示容器
    timeShowEl.innerHTML = `
        <div class="time-display"></div>
        <div class="date-display"></div>
    `;
    
    const timeDisplay = timeShowEl.querySelector('.time-display');
    const dateDisplay = timeShowEl.querySelector('.date-display');

    // 格式化日期和时间（强制东八区）
    function formatDateTime() {
        const now = new Date();
        
        // 关键：获取 北京时间（UTC+8）的 年/月/日/时/分/秒/星期
        const year = now.getUTCFullYear();
        let month = now.getUTCMonth() + 1;
        let day = now.getUTCDate();
        let hours = now.getUTCHours() + 8; // +8 小时变成北京时间

        // 小时进位处理
        if (hours >= 24) {
            hours -= 24;
            day += 1;
        }

        // 获取星期（北京时间）
        let week = now.getUTCDay();
        const hourMap = [0, 1, 2, 3, 4, 5, 6];
        week = (week + Math.floor((now.getUTCHours() + 8) / 24)) % 7;

        // 全部补零
        hours = String(hours).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        month = String(month).padStart(2, '0');
        day = String(day).padStart(2, '0');

        // 拼接时间
        const timeStr = `${hours}:${minutes}:${seconds}`;
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        const dateStr = `${year}-${month}-${day} 星期${weekDays[week]}`;
        
        // 更新DOM
        timeDisplay.textContent = timeStr;
        dateDisplay.textContent = dateStr;
    }

    // 初始化执行一次
    formatDateTime();
    // 每秒更新一次
    setInterval(formatDateTime, 1000);
});