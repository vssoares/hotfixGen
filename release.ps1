param(
    [Parameter(Mandatory)]
    [string]$version
)

$ErrorActionPreference = "Stop"

# --- Versoes ---
Write-Host "--- Atualizando versao para $version ---" -ForegroundColor Cyan

$pkg = Get-Content "package.json" -Raw
$pkg = $pkg -replace '"version": "[\d.]+"', "`"version`": `"$version`""
Set-Content "package.json" $pkg -NoNewline

$conf = Get-Content "src-tauri/tauri.conf.json" -Raw
$conf = $conf -replace '"version": "[\d.]+"', "`"version`": `"$version`""
Set-Content "src-tauri/tauri.conf.json" $conf -NoNewline

$cargo = Get-Content "src-tauri/Cargo.toml"
$inPackage = $false
$cargo = $cargo | ForEach-Object {
    if ($_ -match '^\[package\]') { $inPackage = $true }
    elseif ($_ -match '^\[') { $inPackage = $false }
    if ($inPackage -and $_ -match '^version\s*=') { "version = `"$version`"" } else { $_ }
}
Set-Content "src-tauri/Cargo.toml" $cargo

# --- Commit e push (sem tag, para nao disparar o CI) ---
Write-Host "--- Commitando e subindo ---" -ForegroundColor Cyan
git add .
git commit -m "chore: release v$version"
git push origin main

# --- Build local ---
Write-Host "--- Buildando localmente ---" -ForegroundColor Cyan
npm run build

# --- Artefatos ---
$bundleDir = "src-tauri/target/release/bundle/nsis"
$exe = Get-ChildItem "$bundleDir/*.exe" | Where-Object { $_.Name -notlike "*.sig*" } | Select-Object -First 1
$sig = Get-Item "$($exe.FullName).sig"

if (-not $exe) {
    Write-Error "Instalador nao encontrado em $bundleDir"
    exit 1
}

Write-Host "Artefato: $($exe.Name)" -ForegroundColor Gray

# --- latest.json para o updater ---
$sigContent = Get-Content $sig.FullName -Raw
$pubDate = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$downloadUrl = "https://github.com/vssoares/hotfixGen/releases/download/v$version/$($exe.Name)"

$latestJson = @{
    version   = $version
    notes     = ""
    pub_date  = $pubDate
    platforms = @{
        "windows-x86_64" = @{
            signature = $sigContent.Trim()
            url       = $downloadUrl
        }
    }
} | ConvertTo-Json -Depth 5

$latestJsonPath = "$bundleDir/latest.json"
Set-Content $latestJsonPath $latestJson -NoNewline

# --- GitHub Release ---
Write-Host "--- Criando release v$version no GitHub ---" -ForegroundColor Cyan
gh release create "v$version" $exe.FullName $sig.FullName $latestJsonPath `
    --title "ProjectManager v$version" `
    --notes "Veja os commits para detalhes das mudancas."

Write-Host "=== Release v$version publicado! ===" -ForegroundColor Green
