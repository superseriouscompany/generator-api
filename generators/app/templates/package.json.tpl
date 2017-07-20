{
  "name": "<%= name %>",
  "version": "1.0.0",
  "description": "<%= name %> api",
  "main": "index.js",
  "scripts": {
    "start":        "if [ \"$NODE_ENV\" = \"production\" ]; then node index.js; else nodemon; fi",
    "test":         "mocha",
    "dropTables":   "node db/dropTables.js",
    "createTables": "node db/createTables.js",
    "dynamo":       "docker run -p 8000:8000 deangiberson/aws-dynamodb-local"
  },
  "private": true,
  "author": "<%= author %>"
}
