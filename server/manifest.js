'use strict';

const Dotenv = require('dotenv').config();
const Confidence = require('confidence');
const Toys = require('toys');

if (Dotenv.error) {
    throw Dotenv.error
  }
   
  console.log(Dotenv.parsed)
// Pull .env into process.env
// Dotenv.config({ path: `${__dirname}/.env` });
console.log('ENV--->',process.env.DB_HOST)
// Glue manifest as a confidence store
module.exports = new Confidence.Store({
    server: {
        host: 'localhost',
        port: {
            $env: 'PORT',
            $coerce: 'number',
            $default: 3000
        },
        debug: {
            $filter: { $env: 'NODE_ENV' },
            $default: {
                log: ['error'],
                request: ['error']
            },
            production: {
                request: ['implementation']
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: '../lib', // Main plugin
                options: {}
            },
            {
                plugin: './plugins/swagger'
            },
            {
                plugin: './plugins/sequalize'
            },
            {
                plugin: {
                    $filter: { $env: 'NODE_ENV' },
                    $default: 'hpal-debug',
                    production: Toys.noop
                }
            }
        ]
    }
});