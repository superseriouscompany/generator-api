var Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type:    'input',
      name:    'name',
      message: 'Project name',
      default: this.appname,
    }]).then((answers) => {
      this.log('app name', answers.name)
    })
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('README.md.tpl'),
      this.destinationPath('README.md'),
      { name: 'dope' }
    )

    this.fs.copy(
      this.templatePath('**/!(*.tpl)'),
      this.destinationPath()
    )
  }

  installingPackages() {
    return;
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
