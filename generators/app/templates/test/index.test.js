global.TEST_MODE = true
const expect     = require('expect')
const server     = require('../index')
const {exec}     = require('child_process')

describe('api', function() {
  var serverHandle, dynamoProcess
  this.slow(1000)
  this.timeout(5000)

  before(function(done) {
    serverHandle = server(4200)
    dynamoProcess = exec('docker run -p 8000:8000 deangiberson/aws-dynamodb-local', (err,stdout,stderr) => {
      if( !err.killed ) {
        console.error(err.message)
        process.exit(1)
      }
    })

    // TODO: wait only until docker container is started
    setTimeout(() => {
      var env = Object.assign({}, process.env, {NODE_ENV: 'test'})

      exec('node db/createTables', {env: env}, (err, stdout, stderr) => {
        if( err ) { return done(err) }
        done()
      })
    }, 1000)
  })

  after(function() {
    serverHandle()
    dynamoProcess.kill('SIGINT')
  })

  var routesPath = `${__dirname}/routes`
  require('fs').readdirSync(routesPath).forEach(function(file) {
   const fileName = file.split('.')[0]
   describe(fileName, require(`${routesPath}/${file}`))
  })
})
