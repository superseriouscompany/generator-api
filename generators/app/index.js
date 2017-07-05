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

  writing() {
    this.fs.copy(
      this.templatePath('**/*'),
      this.destinationPath()
    )
  }

  installingPackages() {
    this.npmInstall([
      'expect',
      'mocha',
      'request',
      'request-promise',
    ], { 'save-dev': true })

    this.npmInstall([
      'body-parser',
      'express',
    ])
  }
}
