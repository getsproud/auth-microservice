import Activation from '../models/activation'

import ServiceClient from '../services/client'

const client = new ServiceClient('employee')

const validateActivation = call => new Promise((resolve, reject) => {
  const { token, code } = call.query

  const message = {
    domain: 'auth',
    i18n: 'ACTIVATION_VALIDATION_FAILURE',
    data: false,
    code: 403,
    stack: null,
    error: null
  }

  return (async () => {
    try {
      const activation = await Activation.findOne({ token, code }).exec()

      if (!activation)
        return reject(message)

      if (activation && activation.used) {
        message.i18n = 'ACTIVATION_VALIDATION_EXPIRED'
        message.code = 405
        message.data = false

        return reject(message)
      }

      const query = { _id: activation.employee }
      const employee = await client.send({ type: 'findBy', query })

      if (!employee || !employee.data)
        return reject(message)

      if (employee.data.activated)
        return reject(message)

      activation.used = new Date()

      employee.data.activated = true

      await client.send({ type: 'updateEmployee', query: employee.data })

      await activation.save()

      message.i18n = 'ACTIVATION_VALIDATION_SUCCESS'
      message.data = true
      message.code = 204

      return resolve(message)
    } catch (e) {
      message.error = e.message
      message.stack = e.stack

      return reject(message)
    }
  })()
})

export default validateActivation
