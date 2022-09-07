const Joi = require('joi')

const authSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  isAdmin : Joi.boolean(),
  isModerator : Joi.boolean()
})

module.exports = {authSchema}
