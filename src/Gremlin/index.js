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

  _formatNodes(data) {
    var nodes = [];
    for(var i = 0; i < data.length; i++)
    {
      let props = {};
      for (var val in data[i]) {
        if(typeof data[i][val] === 'object') {
          props[val] = data[i][val][0];
        }
      }
      
      nodes.push({
        id: data[i].id,
        label: data[i].label,
        props: props
      });
    }
    return nodes;
  }

  async getVertexById (id) {
    let vertex = await this.g.V(id).valueMap(true).toList();
    this.dc.close();
    return this._formatNodes(vertex);
  }

}

module.exports = GremlinService