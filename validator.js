const Joi = require('joi');

const validator = (schema) => (payload) => schema.validate(payload, {
    abortEarly: false
})

const productSchema = Joi.object({
    brandModel: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
    type: Joi.string().regex(/^[a-z-]+$/).required(),
    earbuds: Joi.boolean().truthy('yes','y').falsy('no','n').required(),
    bluetooth: Joi.number().less(6).required(),
    price: Joi.number().required(),
    stock: Joi.array().items(Joi.object({store: Joi.string(), qty: Joi.number()})),
    color: Joi.array().items(Joi.string()).required(),
    hours: Joi.object({music: Joi.number().integer(), cableCharging: Joi.number().integer(), boxCharging: Joi.number().integer()}).required(),
    dustWaterproof: Joi.boolean().truthy('yes','y').falsy('no','n').required(),
    connectors: Joi.string().regex(/^[a-z-]+$/).required(),
})

const signupSchema = Joi.object({
    username: Joi.string().alphanum().required(),
    firstname: Joi.string().alphanum().required(),
    lastname: Joi.string().alphanum().required(),
    email: Joi.string().trim().email().regex(/^[a-z-@._]+$/).required(),
    password: Joi.string().trim().min(6).required(),
    comfirmPassword: Joi.ref('password')
})

const loginSchema = Joi.object({
    email: Joi.string().trim().email().regex(/^[a-z-@._]+$/).required(),
    password: Joi.string().trim().min(6).required(),
})

const userUpdateSchema = Joi.object({
    username: Joi.string().alphanum().required(),
    firstname: Joi.string().alphanum().required(),
    lastname: Joi.string().alphanum().required()
})

const reviewSchema = Joi.object({
    
})

exports.validateSignup = validator(signupSchema);
exports.validateLogin = validator(loginSchema);
exports.validateUserUpdate = validator(userUpdateSchema);
exports.validateProduct = validator(productSchema);
exports.validateReview = validator(reviewSchema);