const api = require('./api')

const factory = {
  user: (user) => {
    user = Object.assign({
      name:  'Sancho Panza',
    }, user || {})

    return api.post('/users', { body: user }).then((response) => {
      const user = response.body
      Object.defineProperty(user, 'api', {
        get: function() {
          return api.authenticated(user.accessToken || user.access_token)
        }
      })
      return user
    })
  }
}

module.exports = factory
