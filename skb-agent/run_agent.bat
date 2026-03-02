@echo off
echo [SKB Agent] Starting...
echo [SKB Agent] Compiling SKBAgent.java...
javac -cp ".;skb-cs-openapi-java-1.0.0.jar" SKBAgent.java
if %errorlevel% neq 0 (
    echo [ERROR] Compilation failed. Please ensure JDK is installed and 'javac' is in your PATH.
    pause
    exit /b %errorlevel%
)
echo [SKB Agent] Running Agent...
java -cp ".;skb-cs-openapi-java-1.0.0.jar" SKBAgent
pause
