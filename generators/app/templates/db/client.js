const promisifyAll = require('bluebird').promisifyAll;

module.exports = function(AWS, endpoint) {
  AWS = AWS || require('aws-sdk')

  // TODO: check for region
  const lowLevel = new AWS.DynamoDB(endpoint)
  var client     = new AWS.DynamoDB.DocumentClient(endpoint)

  client = promisifyAll(client)

  client.truncate = function(tableName, schema) {
    return new Promise(function(resolve, reject) {
      lowLevel.deleteTable({ TableName: tableName }, function(err) {
        if( err && err.name != 'ResourceNotFoundException' ) { console.error(err.name); return reject(err); }

        waitForDeletion(tableName, function(err) {
          if( err ) { return reject(err); }

          lowLevel.createTable(schema, function(err) {
            if( err ) { return reject(err); }

            waitForCreation(tableName, function(err) {
              if( err ) { return reject(err); }
              resolve(true);
            })
          })
        })
      })
    })
  }

  client.bulk = function(tableName, ids, fields) {
    if( !tableName ) { return Promise.reject(new Error('InputError: tableName is null')) }
    if( !ids || !ids.length ) { return Promise.reject(new Error('InputError: ids are null, empty or not an array')) }
    if( !fields || !fields.length ) { return Promise.reject(new Error('InputError: fields are null, empty or not an array')) }

    // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    ids = Array.from(new Set(ids))

    return client.batchGetAsync({
      RequestItems: {
        [tableName]: {
          Keys: ids.map((id) => {
            return { id: id }
          }),
          AttributesToGet: fields,
        }
      }
    }).then((payload) => {
      return payload.Responses[tableName]
    })
  }

  client.updateFields = function(tableName, id, fields, whitelist) {
    var updateExpression = 'set '
    var attributeNames   = {}
    var attributeValues  = {}
    var hadValues = false;
    whitelist.forEach(function(field) {
      if( fields[field] !== undefined && fields[field] !== '') {
        attributeNames[`#${field}`]  = field
        attributeValues[`:${field}`] = fields[field]
        updateExpression += `#${field} = :${field},`
        hadValues = true
      }
    })
    if( !hadValues ) { return Promise.reject(new Error(`InputError: no fields found matching ${whitelist.join(', ')} in ${Object.keys(fields).join(', ')}`)) }
    updateExpression = updateExpression.substring(0,updateExpression.length - 1);

    return client.updateAsync({
      TableName:                 tableName,
      Key:                       { id: id },
      ConditionExpression:       'attribute_exists(id)',
      UpdateExpression:          updateExpression,
      ExpressionAttributeValues: attributeValues,
      ExpressionAttributeNames:  attributeNames,
    }).then(function(ok) {
      return true;
    }).catch(function(err) {
      if( err.name == 'ConditionalCheckFailedException' ) {
        throw new Error('NotFound')
      }
      throw err;
    });
  }

  client.lowLevel = lowLevel

  return client

  function waitForDeletion(tableName, cb) {
    lowLevel.describeTable({
      TableName: tableName,
    }, function(err, cool) {
      if( !err ) {
        return setTimeout(function() {
          waitForDeletion(tableName, cb);
        }, 1000);
      }
      if( err.name != 'ResourceNotFoundException' ) {
        return cb(err);
      }
      cb();
    })
  }

  function waitForCreation(tableName, cb) {
    lowLevel.describeTable({
      TableName: tableName,
    }, function(err, data) {
      if( err ) { return cb(err); }
      if( data.Table.TableStatus != 'ACTIVE' ) {
        return setTimeout(function() {
          waitForCreation(tableName, cb);
        }, 1000);
      }
      cb();
    })
  }
}
