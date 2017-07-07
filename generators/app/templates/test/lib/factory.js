const api = require('./api')

const factory = {
  user: (user) => {
    user = Object.assign({
      name:  'Sancho Panza',
    }, user || {})

    return api.post('/users', { body: user }).then((response) => {
      return response.body
    })
  }
}

module.exports = factory
