# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a wrong type fragment
Content-Type: wrong/type

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`
# We expect to get back an HTTP 201
HTTP/1.1 415
# We have various assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "error"
#jsonpath "$error.message" == "Unsupported Media Type"