const expect = require('expect')
const server = require('../index')
const {exec} = require('child_process')

describe('api', function() {
  var serverHandle, dynamoProcess
  this.slow(1000)
  this.timeout(5000)

  before(function() {
    serverHandle = server(4200)
    dynamoProcess = exec('docker run -p 8000:8000 deangiberson/aws-dynamodb-local', (err,stdout,stderr) => {
      if( !err.killed ) {
        console.error(err.message)
        process.exit(1)
      }
    })
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
