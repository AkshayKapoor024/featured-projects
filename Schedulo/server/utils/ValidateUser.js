const joi = require('joi')
module.exports =new joi.object({
    username:joi.string().optional(),
    email:joi.string().required(),
    password:joi.string().optional(),
    googleId:joi.string().optional(),
    bio:joi.string().optional(),
  fullname:joi.string().optional(),
  github:joi.string().optional(),
  instagram:joi.string().optional(),
  linkedin:joi.string().optional(),
  location:joi.string().optional(),
  mobile:joi.string().optional(),
  occupation:joi.string().optional(),
  organization:joi.string().optional(),
  profilepic:joi.string().optional(),
  calendar:joi.object({
    accessToken:joi.string().optional(),
    refreshToken:joi.string().optional()
  })
})
