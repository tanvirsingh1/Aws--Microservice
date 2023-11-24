# Port for the server
PORT=8080

# AWS Amazon Cognito User Pool ID (use your User Pool ID)
AWS_COGNITO_POOL_ID=us-east-1_RFrOXKWhg

# AWS Amazon Cognito Client App ID (use your Client App ID)
AWS_COGNITO_CLIENT_ID=7gnp3pbqb6q3decn6b6g7nldna

API_URL=http://localhost:8080 
