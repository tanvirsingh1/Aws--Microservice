# Health Check Test for a 404 Response

# Testing the endpoint for a wrong route
GET http://localhost:8080/wrong-route

# Expected HTTP 404 Response
HTTP/1.1 404

# Additional Checks (Asserts) for the JSON Response Body
[Asserts]
# Expecting the "status" field in the JSON response to be "error"
jsonpath "$.status" == "error"

# Expecting the "error.message" field in the JSON response to be "not found"
jsonpath "$.error.message" == "not found"

# Expecting the "error.code" field in the JSON response to be 404
jsonpath "$.error.code" == 404
