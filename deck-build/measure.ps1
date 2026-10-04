param([Parameter(Mandatory=$true)][string]$Pptx)

# measure.ps1 - ask PowerPoint's own layout engine how large each text frame
# actually renders. Catches real clipping, which shape-rectangle checks cannot.
$SW = 13.3 * 72.0
$SH = 7.5 * 72.0
$TOL = 1.5   # points of slack before we call it clipped

$ppt = New-Object -ComObject PowerPoint.Application
$total = 0
try {
  $pres = $ppt.Presentations.Open($Pptx, $true, $false, $false)
  foreach ($sl in $pres.Slides) {
    $issues = @()
    foreach ($sh in $sl.Shapes) {
      if (-not $sh.HasTextFrame) { continue }
      $tr = $sh.TextFrame2.TextRange
      if ($tr.Length -eq 0) { continue }

      $L = [double]$sh.Left
      $Tp = [double]$sh.Top
      $W = [double]$sh.Width
      $H = [double]$sh.Height
      $tf = $sh.TextFrame2
      $uH = $H - [double]$tf.MarginTop - [double]$tf.MarginBottom
      $uW = $W - [double]$tf.MarginLeft - [double]$tf.MarginRight
      $bh = [double]$tr.BoundHeight
      $bw = [double]$tr.BoundWidth

      $label = ($tr.Text -replace "\s+", " ")
      if ($label.Length -gt 26) { $label = $label.Substring(0, 26) }
      $loc = "@({0:N2},{1:N2}) {2}x{3}" -f ($L / 72), ($Tp / 72), ($W / 72), ($H / 72)

      if ($bh -gt $uH + $TOL) {
        $issues += ("  CLIP-V  need {0:N1}pt have {1:N1}pt  {2}  {3}" -f $bh, $uH, $loc, $label)
      }
      if ((-not $tf.WordWrap) -and ($bw -gt $uW + $TOL)) {
        $issues += ("  CLIP-H  need {0:N1}pt have {1:N1}pt  {2}  {3}" -f $bw, $uW, $loc, $label)
      }
      # off-slide geometry is covered by audit.py, which reads the raw XML
      $lft = [double]$sh.Left
      $top = [double]$sh.Top
      if ($lft -lt -1 -or $top -lt -1) {
        $issues += ("  OFFSLIDE  {0}  {1}" -f $loc, $label)
      }
    }
    if ($issues.Count -gt 0) {
      "slide {0}:" -f $sl.SlideIndex
      $issues | ForEach-Object { $_ }
      $total += $issues.Count
    }
  }
  $pres.Close()
} finally {
  $ppt.Quit()
}
"TOTAL CLIPPING ISSUES: $total"
