'use strict';
const AWS         = require('aws-sdk');
const secrets     = require('./secrets');
const environment = process.env.NODE_ENV || 'development';

module.exports = Object.assign({
  baseUrl:                 '<%= baseUrl %>',
  awsRegion:               '<%= awsRegion %>',
}, require(`./${environment}`));

AWS.config.update({
  accessKeyId:     secrets.awsAccessKey,
  secretAccessKey: secrets.awsSecretKey,
  region:          module.exports.awsRegion,
});

module.exports.AWS = AWS;
