{
  "name": "<%= name %>",
  "version": "1.0.0",
  "description": "<%= name %> api",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon",
    "test": "mocha",
    "dropTables": "node db/dropTables.js"
  },
  "private": true,
  "author": "<%= author %>"
}
