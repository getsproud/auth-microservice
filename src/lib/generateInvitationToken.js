import Invitation from '../models/invitation'

const generateInvitationToken = call => new Promise((resolve, reject) => {
  const { query } = call

  const message = {
    domain: 'auth',
    i18n: 'INVITATION_CREATION_FAILURE',
    data: null,
    code: 500,
    stack: null,
    error: null
  }

  Invitation.create(query).then(activation => {
    message.i18n = 'INVITATION_SUCCESS'
    message.data = activation
    message.code = 200

    return resolve(message)
  }).catch(e => {
    message.error = e.message
    message.stack = e.stack
    return reject(message)
  })
})

export default generateInvitationToken
