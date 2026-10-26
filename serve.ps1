$port = 8080
$listener = $null

foreach ($p in @(8080, 8081, 5500, 3000)) {
    try {
        $endpoint = [System.Net.IPEndPoint]::new([System.Net.IPAddress]::Any, $p)
        $l = [System.Net.Sockets.TcpListener]::new($endpoint)
        $l.Start()
        $listener = $l
        $port = $p
        break
    } catch {
        # Try next port
    }
}

if (-not $listener) {
    Write-Error "Could not bind to any port."
    exit 1
}

Write-Host "================================================="
Write-Host " ASWIN Portfolio Server is ACTIVE!"
Write-Host " Local URL:    http://localhost:$port/"
Write-Host " Loopback URL: http://127.0.0.1:$port/"
Write-Host "================================================="

# Auto open the browser if running on host
try {
    Start-Process "http://localhost:$port/"
} catch {
    # Ignored if headless/sandboxed
}

$baseDir = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($baseDir)) { $baseDir = (Get-Location).Path }

$mimeMap = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".pdf"  = "application/pdf"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".mp3"  = "audio/mpeg"
    ".mp4"  = "video/mp4"
}

$buffer = New-Object byte[] 8192

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        
        $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
        if ($bytesRead -le 0) {
            $client.Close()
            continue
        }
        
        $requestStr = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $bytesRead)
        $firstLine = $requestStr.Split("`n")[0].Trim()
        $parts = $firstLine.Split(" ")
        $rawUrl = if ($parts.Length -gt 1) { $parts[1] } else { "/" }
        
        $cleanPath = $rawUrl.Split("?")[0].TrimStart("/")
        $cleanPath = [System.Uri]::UnescapeDataString($cleanPath)
        if ([string]::IsNullOrWhiteSpace($cleanPath)) {
            $cleanPath = "index.html"
        }
        
        $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($baseDir, $cleanPath))
        $baseFullPath = [System.IO.Path]::GetFullPath($baseDir)
        
        if (-not $fullPath.StartsWith($baseFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            $body = [System.Text.Encoding]::UTF8.GetBytes("<h1>403 Forbidden</h1>")
            $headers = "HTTP/1.1 403 Forbidden`r`nContent-Length: $($body.Length)`r`nContent-Type: text/html`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($body, 0, $body.Length)
            $stream.Flush()
            $client.Close()
            continue
        }
        
        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $contentType = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
            $contentBytes = [System.IO.File]::ReadAllBytes($fullPath)
            
            $headerText = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($contentBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerText)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($contentBytes, 0, $contentBytes.Length)
            $stream.Flush()
        } else {
            $body = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1><p>$cleanPath</p>")
            $headers = "HTTP/1.1 404 Not Found`r`nContent-Type: text/html`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($body, 0, $body.Length)
            $stream.Flush()
        }
        
        $client.Close()
    } catch {
        # Continue loop on connection or parsing error
    }
}
