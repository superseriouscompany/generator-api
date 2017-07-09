# Tiny API Generator

This is based on my learnings from building an app a month for a year. It's the generic boilerplate I found myself doing for every project.

My goal is to make this do as little as possible while still being useful.

## Installation

    $ npm install -g generator-tinyapi

## Usage

    $ mkdir <projectname> && cd <projectname>
    $ yo tinyapi
    $ npm test
    $ npm start

## Directory Structure

    config/     # environment based config
    db/         # dynamo client, schemas and scripts
    models/     # reusable business logic
    routes/     # express routes
    test/       # mocha integration tests
    index.js    # express server
    henoku.sh   # sets up git-based deploys on host of your choice

## Features

#### Express Server

  * autoload all routes from `routes/` folder
  * healthcheck endpoint
  * catchall error handler
  * returns a handle to close server for use with tests


#### Mocha HTTP Tests

  * support for factories a la factory_girl
  * api request helper with defaults
  * start server automatically before tests and stop after  


#### Configuration based on NODE_ENV


#### Dynamo support

  * script to create and delete tables
  * promisified client
  * local support for testing through docker
