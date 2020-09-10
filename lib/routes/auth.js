'use strict';
const Joi = require('@hapi/joi')
const Boom = require ('@hapi/boom')
const redis = require("redis-mock"),
redisClient = redis.createClient();
const { v4: uuidv4 } = require('uuid')
const JWT = require('jsonwebtoken');   // used to sign our content
const url = require('url'); 
module.exports = [
    {
        method: "GET", path: "/",
        options: {
            auth: false ,
            tags : ['api'],
            handler: function(request, h) {
             return {text: 'Token not required'};
            }
        }
    },{
        method: 'GET', path: '/restricted',
        options: {
            auth: 'jwt' ,
            tags : ['api'],
            handler: function(request, h) {
                const response = h.response({text: 'You used a Token!'});
                response.header("Authorization", request.headers.authorization);
                return response;
            }
        }
    },
    { // implement your own login/auth function here
        method: 'POST', path: "/auth/login",
        options: {
            auth: false ,
            tags : ['api'],
            handler: function(request, reply) {
            var session = {
                valid: true, // this will be set to false when the person logs out
                id: uuidv4(), // a random session id
                exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
            }
            // create the session in Redis
            redisClient.set(session.id, JSON.stringify(session));
            console.log("session.id", session.id)
            // sign the session as a JWT
            var token = JWT.sign(session, process.env.JWT_SECRET); // synchronous
            console.log(token);
    
            return { token }
            }
        }
      },
      {
        method: 'POST', path: "/auth/logout",
        options: {
            auth: 'jwt' ,
            tags : ['api'],
            handler: function(request, reply) {
            // implement your own login/auth function here
            var decoded = JWT.decode(request.headers.authorization,
                process.env.JWT_SECRET);
            var session;
            redisClient.get(decoded.id, function(rediserror, redisreply) {
                /* istanbul ignore if */
                if(rediserror) {
                console.log(rediserror);
                }
                session = JSON.parse(redisreply)
                console.log(' - - - - - - SESSION - - - - - - - -')
                console.log(session);
                // update the session to no longer valid:
                session.valid = false;
                session.ended = new Date().getTime();
                // create the session in Redis
                redisClient.set(session.id, JSON.stringify(session));
    
                return {text: 'You have been logged out!'}
            })
            }
        }
      }
];