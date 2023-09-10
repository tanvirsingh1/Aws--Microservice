# fragments

lint: This script is used for linting the source code. It uses eslintrc.js to define the settings for ESLint.

start: This script runs the server.js file located in our src/ folder.

dev: When we run our application in a development environment, this script is used. It leverages the nodemon package, which automatically monitors changes to the file and restarts server.js. The LOG_LEVEL is set to "debug," providing more detailed and verbose logs for debugging purposes.

debug: This script is very similar to the dev script, with the addition of an inspector. It uses cross-env to set the LOG_LEVEL to "debug" and enables the Node.js inspector with a specific host and port. This feature allows us to attach a debugger to our running Node.js application for debugging purposes.
