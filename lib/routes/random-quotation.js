'use strict';
const Joi = require('@hapi/joi')
module.exports = {
    method: 'get',
    path: '/users/random-quotation/{foo}/',
    options: {
        tags : ['api'],
        validate: {
            params: Joi.object({
              foo: Joi.string().required().description('test')
            })
        },
        handler: (request) => {
            const db1 = request.getDb('estateDB');
            // console.log(db1.sequelize);
            console.log(db1.models);

            const quotations = [
                {
                    quotation: 'I would rather fish any day than go to heaven.',
                    saidBy: 'Cornelia "Fly Rod" Crosby'
                },
                {
                    quotation: 'I want a turkey nut yogurt cane!',
                    saidBy: 'Stimpy'
                },
                {
                    quotation: 'Streams make programming in node simple, elegant, and composable.',
                    saidBy: 'substack'
                }
            ];

            const randomIndex = Math.floor(Math.random() * quotations.length);

            return quotations[randomIndex];
        }
    }
};
