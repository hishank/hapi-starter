"use strict";

module.exports = {
  name: "app-swagger",
  async register(server) {
    await server.register([
      require("inert"),
      require("vision"),
      {
        plugin: require("hapi-swaggered"),
        options: {
          info: {
            title: "Example API",
            description:
              "Powered by node, hapi, joi, hapi-swaggered, hapi-swaggered-ui and swagger-ui",
            version: "1.0",
          },
        },
      },
      {
        plugin: require("hapi-swaggered-ui"),
        options: {
          title: "Example API",
          path: "/docs"
        },
      },
    ]);
  },
};
