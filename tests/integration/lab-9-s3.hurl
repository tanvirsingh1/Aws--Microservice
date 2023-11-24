POST http://localhost:8080/v1/fragments
# Sending a plain text fragment with charset
Content-Type: text/plain; charset=utf-8
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201