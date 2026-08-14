Set ws = CreateObject("WScript.Shell")
ws.Environment("PROCESS")("MOZ_DISABLE_CONTENT_SANDBOX") = "1"
ws.Environment("PROCESS")("MOZ_DISABLE_GMP_SANDBOX") = "1"
ws.Environment("PROCESS")("MOZ_DISABLE_RDD_SANDBOX") = "1"
ws.Environment("PROCESS")("MOZ_DISABLE_SOCKET_PROCESS") = "1"
ws.Run """C:\Users\kygsz\OneDrive\Belgeler\New OpenCode Project\foxai-browser\firefox-foxai\runtime\firefox.exe"" -profile ""C:\Users\kygsz\OneDrive\Belgeler\New OpenCode Project\foxai-browser\firefox-foxai\profile\foxai"" -no-remote about:blank", 0, False
