param(
  [Parameter(Mandatory=$true)][string]$Pptx,
  [Parameter(Mandatory=$true)][string]$OutDir
)
# Export every slide to PNG using the installed PowerPoint (true rendering,
# real fonts, real layout) instead of LibreOffice.
$ErrorActionPreference = "Stop"
if (Test-Path -LiteralPath $OutDir) { Remove-Item -LiteralPath $OutDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$pp = New-Object -ComObject PowerPoint.Application
try {
  $deck = $pp.Presentations.Open($Pptx, $true, $false, $false)
  try {
    $deck.Export($OutDir, "PNG", 1920, 1080)
    Write-Output "slides exported: $($deck.Slides.Count)"
  } finally {
    $deck.Close()
  }
} finally {
  $pp.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($pp) | Out-Null
}
Get-ChildItem -LiteralPath $OutDir -Filter *.PNG | Measure-Object | ForEach-Object { "png files: $($_.Count)" }
Get-ChildItem -LiteralPath $OutDir | Select-Object -First 3 -ExpandProperty Name
