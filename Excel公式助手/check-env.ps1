$ErrorActionPreference = "Stop"

Write-Host "=== 开发环境检查 ===" -ForegroundColor Cyan

# 检查Node.js
Write-Host "`n[1] 检查Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "  $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "  Node.js 未安装" -ForegroundColor Red
    }
} catch {
    Write-Host "  Node.js 未安装" -ForegroundColor Red
}

# 检查Rust
Write-Host "`n[2] 检查Rust..." -ForegroundColor Yellow
try {
    $rustVersion = rustc --version 2>$null
    if ($rustVersion) {
        Write-Host "  $rustVersion" -ForegroundColor Green
    } else {
        Write-Host "  Rust 未安装" -ForegroundColor Red
    }
} catch {
    Write-Host "  Rust 未安装" -ForegroundColor Red
}

# 检查Git
Write-Host "`n[3] 检查Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "  $gitVersion" -ForegroundColor Green
    } else {
        Write-Host "  Git 未安装" -ForegroundColor Red
    }
} catch {
    Write-Host "  Git 未安装" -ForegroundColor Red
}

# 检查WebView2 Runtime
Write-Host "`n[4] 检查WebView2 Runtime..." -ForegroundColor Yellow
try {
    $webview = reg query "HKLM\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" 2>$null
    if ($webview) {
        Write-Host "  WebView2 Runtime 已安装" -ForegroundColor Green
    } else {
        Write-Host "  WebView2 Runtime 未安装" -ForegroundColor Red
    }
} catch {
    Write-Host "  WebView2 Runtime 未安装" -ForegroundColor Red
}

# 检查VS Code
Write-Host "`n[5] 检查VS Code..." -ForegroundColor Yellow
try {
    $vscodeVersion = code --version 2>$null
    if ($vscodeVersion) {
        Write-Host "  $vscodeVersion" -ForegroundColor Green
    } else {
        Write-Host "  VS Code 未安装（可选）" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  VS Code 未安装（可选）" -ForegroundColor Yellow
}

Write-Host "`n=== 检查完成 ===" -ForegroundColor Cyan
