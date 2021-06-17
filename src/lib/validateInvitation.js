import Invitation from '../models/invitation'

const validateInvitation = call => new Promise((resolve, reject) => {
  const { token, company } = call.query

  const message = {
    domain: 'auth',
    i18n: 'INVITATION_VALIDATION_FAILURE',
    data: false,
    code: 403,
    stack: null,
    error: null
  }

  return (async () => {
    try {
      const invitation = await Invitation.findOne({ token, company }).exec()

      if (!invitation)
        return reject(message)

      if (invitation && invitation.used) {
        message.i18n = 'INVITATION_VALIDATION_EXPIRED'
        message.code = 405
        message.data = false

        return reject(message)
      }

      invitation.used = new Date()

      await invitation.save()

      message.i18n = 'INVITATION_VALIDATION_SUCCESS'
      message.data = invitation
      message.code = 204

      return resolve(message)
    } catch (e) {
      message.error = e.message
      message.stack = e.stack

      return reject(message)
    }
  })()
})

export default validateInvitation
