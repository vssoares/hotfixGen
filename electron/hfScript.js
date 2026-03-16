const HF_SCRIPT = `
param(
    [string]$action,
    [string]$version,
    [string]$branchType,
    [string]$branchUs,
    [string]$branchName
)

if (-not $action) {
    Write-Host "Uso: hf [start|finish|delete] [versao]" -ForegroundColor Yellow
    exit 1
}

function Update-MainBranches {
    Write-Host "--- Fazendo fetch ---" -ForegroundColor Yellow
    git fetch --all
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Host "--- Atualizando master ---" -ForegroundColor Yellow
    git checkout master
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    git pull origin master
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Host "--- Atualizando develop ---" -ForegroundColor Yellow
    git checkout develop
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    git pull origin develop
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

switch ($action) {
    "start" {
        if (-not $version) {
            Write-Host "Erro: informe a versao. Exemplo: hf start 3.13.4" -ForegroundColor Red
            exit 1
        }
        Update-MainBranches
        Write-Host "=== Iniciando hotfix $version... ===" -ForegroundColor Cyan
        git flow hotfix start $version
    }

    "finish" {
        if (-not $version) {
            Write-Host "Erro: informe a versao. Exemplo: hf finish 3.13.4" -ForegroundColor Red
            exit 1
        }
        Update-MainBranches
        Write-Host "=== Finalizando hotfix $version... ===" -ForegroundColor Green
        git flow hotfix finish $version -m "v$version" -p
    }

    "delete" {
        if (-not $version) {
            Write-Host "Erro: informe a versao. Exemplo: hf delete 3.13.4" -ForegroundColor Red
            exit 1
        }
        Update-MainBranches
        Write-Host "=== Deletando hotfix $version... ===" -ForegroundColor Magenta
        git flow hotfix delete $version
        Write-Host "=== Hotfix $version deletado ===" -ForegroundColor Magenta
    }

    "delete-branch" {
        if (-not $branchName) {
            Write-Host "Erro: informe o nome completo do branch." -ForegroundColor Red
            exit 1
        }
        Write-Host "=== Deletando branch local '$branchName'... ===" -ForegroundColor Magenta
        git branch -D $branchName
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        Write-Host "=== Branch '$branchName' deletado com sucesso! ===" -ForegroundColor Green
    }

    "new-branch" {
        if (-not $branchType) {
            Write-Host "Erro: tipo do branch e obrigatorio." -ForegroundColor Red
            exit 1
        }
        if (-not $branchName) {
            Write-Host "Erro: nome do branch e obrigatorio." -ForegroundColor Red
            exit 1
        }
        if ($branchUs) {
            $fullBranch = "feature/$branchType-$branchUs-$branchName"
        } else {
            $fullBranch = "feature/$branchType-$branchName"
        }
        Write-Host "=== Criando branch '$fullBranch' a partir de develop... ===" -ForegroundColor Cyan
        git checkout develop
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        git pull origin develop
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        git checkout -b $fullBranch
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        Write-Host "=== Branch '$fullBranch' criado com sucesso! ===" -ForegroundColor Green
    }

    default {
        Write-Host "Comando invalido. Use: hf [start|finish|delete] [versao]" -ForegroundColor Yellow
    }
}
`

module.exports = HF_SCRIPT
