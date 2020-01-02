const { ServiceProvider } = require('@adonisjs/fold')

class GremlinProvider extends ServiceProvider {
  register () {
    this.app.singleton('Neptune/Gremlin', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('../src/Gremlin'))(Config)
    })
  }
}

module.exports = GremlinProvider