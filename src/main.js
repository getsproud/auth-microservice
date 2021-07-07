import { Responder } from 'cote'
import { connect } from 'mongoose'

import authenticate from './lib/authenticate'
import generateActivationToken from './lib/generateActivationToken'
import generateInvitationToken from './lib/generateInvitationToken'
import validateActivation from './lib/validateActivation'
import validateInvitation from './lib/validateInvitation'

const PORT = 50051

const connectRetry = t => {
  let tries = t

  return connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .catch(e => {
      if (tries < 5) {
        tries += 1
        setTimeout(() => connectRetry(tries), 5000)
      }

      throw new Error(e)
    })
}

connectRetry(0)

try {
  const responder = new Responder({
    name: 'Authentication Service', port: PORT, key: 'auth'
  })

  responder.on('authenticate', authenticate)
  responder.on('generateActivationToken', generateActivationToken)
  responder.on('generateInvitationToken', generateInvitationToken)
  responder.on('validateActivation', validateActivation)
  responder.on('validateInvitation', validateInvitation)

  responder.on('liveness', () => new Promise(resolve => resolve(200)))
  responder.on('readiness', () => new Promise(resolve => resolve(200)))

  // eslint-disable-next-line
  console.log(`🤩 Authentication Microservice bound to port ${PORT}`)
} catch (e) {
  // eslint-disable-next-line
  console.error(`${e.message}`)
  throw new Error(e)
}
