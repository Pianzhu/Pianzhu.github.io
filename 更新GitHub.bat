@echo off
chcp 65001 >nul
cls
echo.
echo ====================================================
echo           快捷导航仓库 - 自动同步工具
echo ====================================================
echo.
echo 功能：一键提交所有修改并同步到 GitHub 远程仓库
echo.
echo ================ 开始同步 ================
echo.

echo 正在检查文件变更...
echo ----------------------------------------------------
git add .
git diff --cached --name-status
echo ----------------------------------------------------
echo 已添加所有文件到暂存区
echo.

:: 获取当前时间，自动作为提交记录
for /f "tokens=2 delims==" %%a in ('wmic path win32_operatingsystem get LocalDateTime /value 2^>nul') do set dt=%%a
set "datetime=%dt:~0,4%-%dt:~4,2%-%dt:~6,2% %dt:~8,2%:%dt:~10,2%:%dt:~12,2%"
git commit -m "更新于 %datetime%" >nul 2>&1
echo 已生成提交记录：更新于 %datetime%
echo.

echo 正在推送到 GitHub 云端，请稍候...
echo.

git push

echo.
echo ================ 同步完成 ================
echo.
echo 同步成功！你的仓库已更新到 GitHub！
echo.
pause