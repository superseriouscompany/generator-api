global.TEST_MODE = true
const expect     = require('expect')
const server     = require('../index')
const {exec}     = require('child_process')

// TODO: make local dynamo setup separate and composable
describe('api', function() {
  var serverHandle, dynamoProcess
  this.slow(1000)
  this.timeout(5000)

  before(function(done) {
    serverHandle = server(4200)
    checkDynamo((err, up) => {
      if( err ) {
        console.error(err.message)
        process.exit(1)
      }

      if( up ) { createTables(done) }
      else {
        dynamoProcess = exec('docker run -p 8000:8000 deangiberson/aws-dynamodb-local', (err,stdout,stderr) => {
          if( !err.killed ) {
            console.error(err.message)
            process.exit(1)
          }
        })

        waitForDynamo(+new Date, 2000, () => createTables(done))
      }
    })
  })

  after(function() {
    serverHandle()
    dynamoProcess && dynamoProcess.kill('SIGINT')
  })

  var routesPath = `${__dirname}/routes`
  require('fs').readdirSync(routesPath).forEach(function(file) {
   const fileName = file.split('.')[0]
   describe(fileName, require(`${routesPath}/${file}`))
  })
})

function waitForDynamo(since, time, cb) {
  checkDynamo((err, up) => {
    if( err ) { return cb(err) }
    if( up ) { return cb(null, true) }
    if( +new Date > since + time ) { return cb(new Error(`Timed out after ${time / 1000} seconds.`))}
    return waitForDynamo(since, time, cb)
  })
}

function checkDynamo(cb) {
  exec('echo > /dev/tcp/localhost/8000', (err, stdout, stderr) => {
    if( err ) {
      if( err.message.match(/Connection refused/) ) {
        return cb(null, false)
      }
      cb(err)
    }

    cb(null, true)
  })
}

function createTables(cb) {
  var env = Object.assign({}, process.env, {NODE_ENV: 'test'})
  exec('node db/createTables', {env: env}, cb)
}
