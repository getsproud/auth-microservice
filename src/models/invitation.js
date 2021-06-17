import { Schema, model } from 'mongoose'
import { generate } from 'rand-token'

const schema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  identifier: {
    type: Schema.Types.String,
    required: true
  },
  token: {
    type: Schema.Types.String,
    required: true,
    default: () => generate(128),
    index: true
  },
  used: Schema.Types.Date
}, { timestamps: true })

const Invitation = model('invitation', schema)

export default Invitation
