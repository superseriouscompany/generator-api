var Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type:    'input',
      name:    'name',
      message: 'Project name',
      default: this.appname,
    }, {
      type: 'input',
      name: 'author',
      message: 'Your name',
      default: 'Sancho Panza',
    }]).then((answers) => {
      this.answers = answers
    })
  }

  writing() {
    const {answers} = this

    this.fs.copyTpl(
      this.templatePath('README.md.tpl'),
      this.destinationPath('README.md'),
      answers
    )
    this.fs.copyTpl(
      this.templatePath('package.json.tpl'),
      this.destinationPath('package.json'),
      answers
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
