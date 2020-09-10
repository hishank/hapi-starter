const { Boom } = require('@hapi/boom')

const redis = require('redis-mock'),
  redisClient = redis.createClient()

// validate JWT payload
exports.validate = async (decoded, request) => {
  try {
    const { User } = request.getDb('estateDB').models
    // const users = await User.findAll()

    return new Promise((resolve, reject) => {
      redisClient.get(decoded.id, function (rediserror, reply) {
        /* istanbul ignore if */
        if (rediserror) {
          console.log(rediserror)
          reject({ errorMessage: rediserror, isValid: false })
        }
        var session
        if (reply) {
          session = JSON.parse(reply)
        } else {
          // unable to find session in redis ... reply is null
          return resolve({
            errorMessage: rediserror,
            isValid: false,
            credentials: reply,
          })
        }

        if (session.valid === true) {
          return resolve({
            errorMessage: rediserror,
            isValid: true,
            credentials: reply,
          })
        } else {
          return resolve({
            errorMessage: rediserror,
            isValid: false,
            credentials: reply,
          })
        }
      })
    })
  } catch (error) {
    console.log('exports.validate -> error', error)
    return Boom.badImplementation()
  }
}
