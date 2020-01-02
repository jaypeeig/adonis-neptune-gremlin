'use strict'

const gremlin = require('gremlin');

class GremlinService {

  constructor (Config) {
    this.Config = Config;
    this._init();
  }

  _init() {
    const Graph = gremlin.structure.Graph;
    const graph = new Graph();
    const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
    this.dc = new DriverRemoteConnection(`wss://${this.Config.get(`neptune.endpoint`)}:${this.Config.get(`neptune.port`)}/gremlin`);
    this.g = graph.traversal().withRemote(this.dc);
  }

  _objFormat (response) {
    let obj = [];
    for(var key in response) {
      let r = response[key];

      let data = {};
      data.id = r.id;
      data.label = r.label;
      data.type = r.type;
      data.prop = {};

      for(var p in r.properties) {
          data.prop[p] = r.properties[p][0].value;
      }

      obj.push(data);
    }
    return obj;
  } 

  async getVertexById (id) {
    let vertex = await this.g.V(id).valueMap(true).toList();
    this.dc.close();
    return this._objFormat(vertex);
  }

}

module.exports = GremlinService