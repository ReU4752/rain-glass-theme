param(
    [string]$Ref = "master"
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$themeDir = Split-Path -Parent (Split-Path -Parent $scriptDir)
$vendorPath = Join-Path $themeDir "static/vendor/raindrop-fx.js"
$versionPath = Join-Path $scriptDir "VERSION"
$shaPath = Join-Path $scriptDir "SHA256"
$sourcePath = Join-Path $scriptDir "SOURCE.txt"
$url = "https://raw.githubusercontent.com/SardineFish/raindrop-fx/$Ref/bundle/index.js"
$tempPath = Join-Path $env:TEMP "raindrop-fx.$Ref.js"

Invoke-WebRequest -Uri $url -OutFile $tempPath
Move-Item -Force -LiteralPath $tempPath -Destination $vendorPath

$hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $vendorPath).Hash

Set-Content -LiteralPath $versionPath -Value @(
    "ref=$Ref"
    "source=$url"
) -Encoding ascii

Set-Content -LiteralPath $shaPath -Value $hash -Encoding ascii

Set-Content -LiteralPath $sourcePath -Value @(
    "Project: SardineFish/raindrop-fx"
    "Repository: https://github.com/SardineFish/raindrop-fx"
    "Bundle path: bundle/index.js"
    "Raw URL template: https://raw.githubusercontent.com/SardineFish/raindrop-fx/<ref>/bundle/index.js"
) -Encoding ascii

Write-Host "Updated raindrop-fx"
Write-Host "ref: $Ref"
Write-Host "sha256: $hash"
