param(
  [int]$Port = 5173
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "Site running at $prefix"
Write-Host "Press Ctrl+C to stop."

function Get-ContentType([string]$path) {
  switch ([System.IO.Path]::GetExtension($path).ToLowerInvariant()) {
    '.html' { 'text/html; charset=utf-8' }
    '.css' { 'text/css; charset=utf-8' }
    '.js' { 'text/javascript; charset=utf-8' }
    '.json' { 'application/json; charset=utf-8' }
    '.png' { 'image/png' }
    '.jpg' { 'image/jpeg' }
    '.jpeg' { 'image/jpeg' }
    '.webp' { 'image/webp' }
    '.gif' { 'image/gif' }
    '.svg' { 'image/svg+xml' }
    '.ico' { 'image/x-icon' }
    '.woff' { 'font/woff' }
    '.woff2' { 'font/woff2' }
    '.txt' { 'text/plain; charset=utf-8' }
    default { 'application/octet-stream' }
  }
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $rawPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
    if ($rawPath -eq '/') {
      $rawPath = '/index.html'
    }

    $relativePath = $rawPath.TrimStart('/')
    $filePath = Join-Path $root $relativePath

    $resolvedRoot = [System.IO.Path]::GetFullPath($root)
    $resolvedFile = [System.IO.Path]::GetFullPath($filePath)

    if (-not $resolvedFile.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
      $response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
      continue
    }

    if (Test-Path $resolvedFile -PathType Container) {
      $resolvedFile = Join-Path $resolvedFile 'index.html'
    }

    if (-not (Test-Path $resolvedFile -PathType Leaf)) {
      $response.StatusCode = 404
      $response.ContentType = 'text/plain; charset=utf-8'
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
      continue
    }

    $response.StatusCode = 200
    $response.ContentType = Get-ContentType $resolvedFile
    $response.Headers['Cache-Control'] = 'no-cache'

    $bytes = [System.IO.File]::ReadAllBytes($resolvedFile)
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.Close()
  }
}
finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}
