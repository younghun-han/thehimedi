@echo off
setlocal

echo ===========================================
echo   더하이메디 SKB 중앙 집중식 매니저 (v2.0)
echo ===========================================

:: 64비트 시스템에서도 32비트 컴파일러 우선 탐색 (SKB DLL은 32비트)
set CSC_PATH=
if exist "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe" (
    set CSC_PATH="C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
)
if exist "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" (
    if "%CSC_PATH%"=="" set CSC_PATH="C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
)

if "%CSC_PATH%"=="" (
    echo [오류] .NET Framework 4.0을 찾을 수 없습니다.
    pause
    exit /b
)

echo [1/2] 에이전트 엔진 빌드 중...
%CSC_PATH% /nologo /platform:x86 /out:SKBAgent.exe SKBAgentNative.cs
if %ERRORLEVEL% neq 0 (
    echo [오류] 에이전트 빌드 실패.
    pause
    exit /b
)

echo [2/2] 중앙 제어 시스템 빌드 중...
%CSC_PATH% /nologo /platform:x86 /out:SKBManager.exe SKBManager.cs
if %ERRORLEVEL% neq 0 (
    echo [오류] 매니저 빌드 실패.
    pause
    exit /b
)

echo.
echo [성공] 빌드 완료! 매니저 시작 중...
echo.

SKBManager.exe

pause
