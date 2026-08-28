# tests\lib\bidi.ps1 - WebDriver BiDi helpers for FoxAI tests.

function Connect-Bidi {
  param([int]$Port = 9223)
  $ws = [System.Net.WebSockets.ClientWebSocket]::new()
  $ws.ConnectAsync([Uri]"ws://127.0.0.1:$Port/session", [System.Threading.CancellationToken]::None).Wait()
  Start-Sleep -Milliseconds 800
  $null = Cmd $ws 1 "session.new" @{ capabilities = @{ alwaysMatch = @{ acceptInsecureCerts = $true } } }
  $out = Cmd $ws 2 "browsingContext.create" @{ type = "tab"; userContext = "default" }
  $ctx = ($out | ConvertFrom-Json).result.context
  return @{ Ws = $ws; Ctx = $ctx }
}

function Send-Ws($ws, $payload) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
  $seg = [System.ArraySegment[byte]]::new($bytes)
  $ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()
  $buffer = New-Object byte[] 4194304
  $sb = New-Object System.Text.StringBuilder
  $result = $null
  do {
    $seg2 = [System.ArraySegment[byte]]::new($buffer)
    $t = $ws.ReceiveAsync($seg2, [System.Threading.CancellationToken]::None)
    if (-not $t.Wait(20000)) { throw "ws receive timeout" }
    $result = $t.Result
    $str = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)
    [void]$sb.Append($str)
  } while (-not $result.EndOfMessage)
  return $sb.ToString()
}

function Cmd($ws, $id, $method, $params) {
  $msg = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Depth 12 -Compress
  return Send-Ws $ws $msg
}

function Navigate($ws, $ctx, $url, [int]$WaitMs = 3000) {
  $null = Cmd $ws 500 "browsingContext.navigate" @{ context = $ctx; url = $url; wait = "complete" }
  if ($WaitMs -gt 0) { Start-Sleep -Milliseconds $WaitMs }
}

function Eval-Str($ws, $id, $ctx, $expression) {
  $params = @{ target = @{ context = $ctx }; expression = $expression; awaitPromise = $true }
  $raw = Cmd $ws $id "script.evaluate" $params
  return ($raw | ConvertFrom-Json).result.result.value
}

function Read-AddonUuid($ws, $ctx, $addonId) {
  Navigate $ws $ctx "about:debugging#/runtime/this-firefox" 8000
  $text = ""
  for ($i=0; $i -lt 5; $i++) {
    $text = Eval-Str $ws (601+$i) $ctx "document.body.innerText"
    if ($text.IndexOf($addonId) -ge 0) { break }
    Start-Sleep -Milliseconds 1500
  }
  $idx = $text.IndexOf($addonId)
  if ($idx -lt 0) { return "" }
  $sub = $text.Substring($idx)
  if ($sub -match "Internal UUID\s+([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})") {
    return $matches[1]
  }
  return ""
}

function Close-Bidi($ws, $ctx) {
  try {
    if ($ctx) { $null = Cmd $ws 900 "browsingContext.close" @{ context = $ctx } }
    $null = Cmd $ws 901 "session.end" @{}
  } catch {}
  try { $ws.Dispose() } catch {}
}
