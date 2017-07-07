{
  "name": "<%= name %>",
  "version": "1.0.0",
  "description": "<%= name %> api",
  "main": "index.js",
  "scripts": {
    "start":        "node index.js",
    "dev":          "nodemon",
    "test":         "mocha",
    "dropTables":   "node db/dropTables.js",
    "createTables": "node db/createTables.js",
    "dynamo":       "docker run -p 8000:8000 deangiberson/aws-dynamodb-local"
  },
  "private": true,
  "author": "<%= author %>"
}