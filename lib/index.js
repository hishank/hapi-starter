'use strict';

const HauteCouture = require('haute-couture');
const Package = require('../package.json');
const { validate } = require ('../lib/helpers/auth')
exports.plugin = {
    pkg: Package,
    register: async (server, options) => {

        // Custom plugin code can go here

        await server.register(require('hapi-auth-jwt2'));
        server.auth.strategy('jwt', 'jwt',
            { key: process.env.JWT_SECRET, // Never Share your secret key
            validate,  // validate function defined above
            verifyOptions: { algorithms: [ 'HS256' ] } 
        });
    
        // server.auth.default('jwt');

        await HauteCouture.using()(server, options);
    }
};
