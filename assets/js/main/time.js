// ==========================
// 时间显示（核心）- 修复版
// ==========================
// 确保DOM完全加载后执行（双重保障）
document.addEventListener('DOMContentLoaded', () => {
    // 1. 先校验元素是否存在
    const timeShowEl = document.querySelector('.time-show');
    if (!timeShowEl) {
        console.error("❌ 未找到.time-show容器，时间显示失败");
        return;
    }
    
    // 初始化时间显示容器（覆盖原有内容）
    timeShowEl.innerHTML = `
        <div class="time-display"></div>
        <div class="date-display"></div>
    `;
    
    // 2. 校验子元素是否创建成功
    const timeDisplay = timeShowEl.querySelector('.time-display');
    const dateDisplay = timeShowEl.querySelector('.date-display');
    if (!timeDisplay || !dateDisplay) {
        console.error("❌ 时间/日期子元素创建失败");
        return;
    }

    // 格式化日期和时间（修复时区计算逻辑）
    function formatDateTime() {
        const now = new Date();
        // 方案1：简化版北京时间计算（更稳定）
        const beijingTime = new Date(now.getTime() + 8 * 3600 * 1000); // UTC+8 直接计算
        
        // 提取时间字段（补零）
        const hours = String(beijingTime.getUTCHours()).padStart(2, '0');
        const minutes = String(beijingTime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(beijingTime.getUTCSeconds()).padStart(2, '0');
        const year = beijingTime.getUTCFullYear();
        const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0');
        const day = String(beijingTime.getUTCDate()).padStart(2, '0');
        const week = beijingTime.getUTCDay();
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

        // 拼接字符串
        const timeStr = `${hours}:${minutes}:${seconds}`;
        const dateStr = `${year}-${month}-${day} 星期${weekDays[week]}`;
        
        // 更新DOM（加日志便于调试）
        timeDisplay.textContent = timeStr;
        dateDisplay.textContent = dateStr;
        console.log(`✅ 时间更新：${timeStr} | ${dateStr}`);
    }

    // 初始化执行 + 每秒更新
    formatDateTime();
    setInterval(formatDateTime, 1000);
});