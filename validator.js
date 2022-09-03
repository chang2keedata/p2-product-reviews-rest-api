const Joi = require('joi');
const positiveInt = Joi.number().integer().positive().required();
const positiveNum =  Joi.number().positive().required();
const alphanum = Joi.string().alphanum().required();
const email = Joi.string().trim().email().regex(/^[a-z0-9-@._]+$/).required();
const password = Joi.string().trim().min(6).required();

const validator = (schema) => (payload) => schema.validate(payload, {
    abortEarly: false
});

const productSchema = Joi.object({
    brandModel: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).required(),
    type: Joi.string().regex(/^[a-z-]+$/).required(),
    earbuds: Joi.boolean().required(),
    bluetooth: positiveNum.less(6),
    price: positiveNum,
    stock: Joi.array().items(Joi.object({store: Joi.string(), qty: positiveInt})),
    color: Joi.array().items(Joi.string()).required(),
    hours: Joi.object({music: positiveInt, cableCharging: positiveInt, boxCharging: positiveInt.allow(0)}).required(),
    dustWaterproof: Joi.boolean().required(),
    connectors: Joi.string().regex(/^[a-z-]+$/).required()
})

const paramsQuerySchema = Joi.object({
    type: Joi.string().regex(/^[a-z-]+$/),
    otherType: Joi.string().regex(/^[a-z-]+$/),
    store: Joi.string().regex(/^[a-z]+$/),
    color: Joi.string().regex(/^[a-z]+$/),
    otherColor: Joi.string().regex(/^[a-z&,]+$/),
    otherHours: Joi.number(),
    min_price: Joi.number(),
    max_price: Joi.number(),
    id: Joi.string().alphanum().trim(),
    reviewid: Joi.string().alphanum().trim(),
    limit: Joi.number().integer().positive(),
    page: Joi.number().integer().positive(),
    email: Joi.string().trim().email().regex(/^[a-z0-9-@._]+$/)
})

const reviewSchema = Joi.object({
    email: email,
    comments: Joi.string().required(),
    rating:  positiveInt.less(6)
})

const signupSchema = Joi.object({
    username: alphanum,
    firstname: alphanum,
    lastname: alphanum,
    email: email,
    password: password,
    comfirmPassword: Joi.ref('password')
})

const loginSchema = Joi.object({
    email: email,
    password: Joi.any()
})

const userUpdateSchema = Joi.object({
    username: alphanum,
    firstname: alphanum,
    lastname: alphanum
})

exports.validateSignup = validator(signupSchema);
exports.validateLogin = validator(loginSchema);
exports.validateUserUpdate = validator(userUpdateSchema);
exports.validateProduct = validator(productSchema);
exports.validateReview = validator(reviewSchema);
exports.validateParamsQuery = validator(paramsQuerySchema);