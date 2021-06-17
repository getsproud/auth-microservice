import { Schema, model } from 'mongoose'
import { generate } from 'rand-token'

const schema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: Schema.Types.String,
    required: true,
    default: () => generate(128),
    index: true
  },
  code: {
    type: Schema.Types.String,
    default: () => (`000000${Math.floor((Math.random() * 1000000) + 1)}`).slice(-6),
    index: true
  },
  used: Schema.Types.Date
}, { timestamps: true })

const Activation = model('activation', schema)

export default Activation
