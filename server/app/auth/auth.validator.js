

var validate = require('express-validation')
  , Joi = require('joi');

var signupBody = Joi.object({
  email: Joi.string().max(255).email().required(),
  password: Joi.string().max(50).required() // arbitrary :)
});

var signinBody = Joi.object({
  email: Joi.string().max(255).email().required(),
  password: Joi.string().max(50).required()
});

var resetPasswordBody = Joi.object([{
  email: Joi.string().max(255).email().required(),
  password: Joi.string().max(50).required()
}, {
  k: Joi.string().required()
}]);

module.exports.validateSignupBody = validate({body: signupBody});
module.exports.validateSigninBody = validate({body: signinBody});
module.exports.validateResetPasswordBody = validate({body: resetPasswordBody});