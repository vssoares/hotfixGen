param(
    [Parameter(Mandatory = $false)]
    [string]$version,

    [switch]$patch,
    [switch]$minor,
    [switch]$major,

    [string]$branch = "main"
)

$ErrorActionPreference = "Stop"

function Get-SemverParts([string]$v) {
    if ($v -notmatch '^\d+\.\d+\.\d+$') {
        throw "Versao invalida: '$v'. Use o formato X.Y.Z (ex: 1.2.3)."
    }
    $p = $v.Split(".") | ForEach-Object { [int]$_ }
    return @{ major = $p[0]; minor = $p[1]; patch = $p[2] }
}

function Inc-Version([string]$v, [string]$kind) {
    $p = Get-SemverParts $v
    switch ($kind) {
        "major" { return "{0}.0.0" -f ($p.major + 1) }
        "minor" { return "{0}.{1}.0" -f $p.major, ($p.minor + 1) }
        "patch" { return "{0}.{1}.{2}" -f $p.major, $p.minor, ($p.patch + 1) }
        default { throw "Tipo de incremento desconhecido: $kind" }
    }
}

function Set-JsonVersion([string]$path, [string]$newVersion) {
    $raw = Get-Content $path -Raw
    $updated = $raw -replace '"version"\s*:\s*"[\d.]+"', "`"version`": `"$newVersion`""
    Set-Content $path $updated -NoNewline
}

function Set-CargoTomlVersion([string]$path, [string]$newVersion) {
    $cargo = Get-Content $path
    $inPackage = $false
    $cargo = $cargo | ForEach-Object {
        if ($_ -match '^\[package\]') { $inPackage = $true }
        elseif ($_ -match '^\[') { $inPackage = $false }
        if ($inPackage -and $_ -match '^version\s*=') { "version = `"$newVersion`"" } else { $_ }
    }
    Set-Content $path $cargo
}

# --- Determinar versao alvo ---
$confObj = Get-Content "src-tauri/tauri.conf.json" -Raw | ConvertFrom-Json
$current = [string]$confObj.version
if (-not $current) { throw "Nao foi possivel ler a versao atual em src-tauri/tauri.conf.json" }

$bumpFlags = @($patch, $minor, $major) | Where-Object { $_.IsPresent }
if (-not $version) {
    if ($bumpFlags.Count -eq 0) { $version = Inc-Version $current "patch" }
    elseif ($bumpFlags.Count -gt 1) { throw "Use apenas um entre -patch, -minor, -major." }
    elseif ($patch) { $version = Inc-Version $current "patch" }
    elseif ($minor) { $version = Inc-Version $current "minor" }
    elseif ($major) { $version = Inc-Version $current "major" }
} else {
    if ($bumpFlags.Count -gt 0) { throw "Nao combine -version com -patch/-minor/-major." }
    [void](Get-SemverParts $version)
}

Write-Host "--- Preparando release $version (CI) ---" -ForegroundColor Cyan
Write-Host "Versao atual: $current" -ForegroundColor Gray

# --- Atualizar versoes ---
Set-JsonVersion "package.json" $version
Set-JsonVersion "src-tauri/tauri.conf.json" $version
Set-CargoTomlVersion "src-tauri/Cargo.toml" $version

# --- Commit e push ---
git status --porcelain | Out-Host
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "chore: release v$version"
git push origin $branch

Write-Host "=== Push feito. O GitHub Actions vai criar a tag v$version e publicar a release. ===" -ForegroundColor Green

