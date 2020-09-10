"use strict";

const { Sequelize } = require('sequelize')

const opts = {
    host : process.env.DB_HOST,
    dialect:'mysql'
}
const path = require('path');
module.exports = {
  name: "sequalize",
  async register(server) {
    await server.register([
        {
            plugin: require('hapi-sequelizejs'),
            options: [
                {
                    name: process.env.DB_NAME, // identifier
                    models: [__dirname + '/../../db/models/*.js'], // paths/globs to model files
                    sequelize: new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS,opts), // sequelize instance
                    sync: false, // sync models - default false
                    forceSync: false, // force sync (drops tables) - default false
                },
            ],
        },
    ]);
  },
};
