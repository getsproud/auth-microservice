import bcrypt from 'bcryptjs'

import ServiceClient from '../services/client'

const client = new ServiceClient('employee')

const authenticate = call => new Promise((resolve, reject) => {
  const { identifier, password } = call.query

  const message = {
    domain: 'auth',
    i18n: 'AUTHENTICATION_FAILURE',
    data: null,
    code: 401,
    stack: null,
    error: null
  }

  const query = { identifier: identifier.toLowerCase() }

  return (async () => {
    try {
      const employee = await client.send({ type: 'findBy', query, password: true })

      if (!employee.data || !employee.data.activated || !employee.data.password)
        return reject(message)

      const authenticated = await bcrypt.compare(password, employee.data.password)

      if (!authenticated)
        return reject(message)

      delete employee.data.password

      message.i18n = 'AUTHENTICATION_SUCCESS'
      message.data = employee.data
      message.code = 200

      return resolve(message)
    } catch (e) {
      message.error = e.message
      message.stack = e.stack
      return reject(message)
    }
  })()
})

export default authenticate
