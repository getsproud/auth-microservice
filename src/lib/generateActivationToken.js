import Activation from '../models/activation'

const generateActivationToken = call => new Promise((resolve, reject) => {
  const { id } = call.query

  const message = {
    domain: 'auth',
    i18n: 'ACTIVATION_CREATION_FAILURE',
    data: null,
    code: 500,
    stack: null,
    error: null
  }

  Activation.create({ employee: id }).then(activation => {
    message.i18n = 'AUTHENTICATION_SUCCESS'
    message.data = activation
    message.code = 200

    return resolve(message)
  }).catch(e => {
    message.error = e.message
    message.stack = e.stack
    return reject(message)
  })
})

export default generateActivationToken
