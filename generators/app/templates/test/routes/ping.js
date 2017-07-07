const expect = require('expect')
const api    = require('../helpers/api')

module.exports = function() {
  it("provides healthcheck", function () {
    return api('/').then((response) => {
      expect(response.statusCode).toEqual(200)
      expect(response.body.version).toEqual(1)
    })
  })
}
