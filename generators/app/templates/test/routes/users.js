const factory = require('../lib/factory')
const expect  = require('expect')

module.exports = function() {
  it("builds from factory", function () {
    return factory.user().then((user) => {
      expect(user.id).toExist()
    })
  });
}
