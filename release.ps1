param(
    [Parameter(Mandatory)]
    [string]$version
)

$ErrorActionPreference = "Stop"

Write-Host "--- Atualizando versao para $version ---" -ForegroundColor Cyan

# package.json
$pkg = Get-Content "package.json" -Raw
$pkg = $pkg -replace '"version": "[\d.]+"', "`"version`": `"$version`""
Set-Content "package.json" $pkg -NoNewline

# tauri.conf.json
$conf = Get-Content "src-tauri/tauri.conf.json" -Raw
$conf = $conf -replace '"version": "[\d.]+"', "`"version`": `"$version`""
Set-Content "src-tauri/tauri.conf.json" $conf -NoNewline

# Cargo.toml (apenas a linha do [package])
$cargo = Get-Content "src-tauri/Cargo.toml"
$inPackage = $false
$cargo = $cargo | ForEach-Object {
    if ($_ -match '^\[package\]') { $inPackage = $true }
    elseif ($_ -match '^\[') { $inPackage = $false }

    if ($inPackage -and $_ -match '^version\s*=') {
        "version = `"$version`""
    } else {
        $_
    }
}
Set-Content "src-tauri/Cargo.toml" $cargo

Write-Host "--- Commitando ---" -ForegroundColor Cyan
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "chore: release v$version"

Write-Host "--- Criando tag v$version ---" -ForegroundColor Cyan
git tag "v$version"

Write-Host "--- Subindo ---" -ForegroundColor Cyan
git push origin main
git push origin "v$version"

Write-Host "=== Release v$version publicado! ===" -ForegroundColor Green
