var Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type:    'input',
      name:    'name',
      message: 'Project name',
      default: this.appname,
    }, {
      type:    'input',
      name:    'author',
      message: 'Your name',
      default: 'Sancho Panza',
    }, {
      type:    'input',
      name:    'awsRegion',
      message: 'AWS Region',
      default: 'us-west-2',
    }, {
      type:    'input',
      name:    'awsAccessKey',
      message: 'AWS Access Key',
    }, {
      type:    'input',
      name:    'awsSecretKey',
      message: 'AWS Secret Key',
    }, {
      type:    'input',
      name:    'baseUrl',
      message: 'Base URL of dev server',
      default: 'https://superserious.ngrok.io',
    }]).then((answers) => {
      this.answers = answers
    })
  }

  writing() {
    const {answers} = this

    // copy over all files that do not end in .tpl
    this.fs.copy(
      this.templatePath('**/!(*.tpl)'),
      this.destinationPath()
    );

    this.fs.copy(
      this.templatePath('gitignore.tpl'),
      this.destinationPath('.gitignore')
    );

    [
      'README.md.tpl',
      'package.json.tpl',
      'config/index.js.tpl',
      'config/development.js.tpl',
      'config/production.js.tpl',
      'config/secrets.js.tpl',
      'config/test.js.tpl',
    ].forEach((path) => {
      this.fs.copyTpl(
        this.templatePath(path),
        this.destinationPath(path.replace(/\.tpl$/, '')),
        answers
      )
    })
  }

  installingPackages() {
    this.npmInstall([
      'expect',
      'mocha',
      'request',
      'request-promise',
      'nodemon',
    ], { 'save-dev': true })

    this.npmInstall([
      'aws-sdk',
      'body-parser',
      'express',
      'shortid',
      'uuid',
    ])
  }
}
