var Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type:    'input',
      name:    'name',
      message: 'Project name',
      default: this.appname,
    }, {
      type: 'confirm',
      name: 'dynamo',
      message: 'Enable dynamodb support?'
    }]).then((answers) => {
      this.log('app name', answers.name)
      this.log('dynamo', answers.dynamo)
    })
  }

  method1() {
    this.log('method 1 just ran');
  }

  method2() {
    this.log('method 2 just ran');
  }
}
