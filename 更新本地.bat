@echo off
chcp 65001 >nul
cls
echo.
echo ====================================================
echo            快捷导航仓库 - 拉取远程更新
echo ====================================================
echo.
echo  功能：从 GitHub 同步最新代码到本地
echo.
echo  ================ 开始拉取 ================
echo.

git pull
echo  ✅ 已从 GitHub 拉取最新内容

echo.
echo  ================ 拉取完成 ================
echo.
echo  🎉 本地已同步 GitHub 最新代码！
echo.
pause