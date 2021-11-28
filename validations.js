//Validation
const Joi = require('joi');

//Register validation
const registerValidation = data => {
    const schema = Joi.object({
        firstname: Joi.string()
            .min(2)
            .required(),
        lastname: Joi.string()
            .required(),
        birthday: Joi.date()
            .min('1900-01-01')
            .max('2021-11-28')
            .required(),
        gender: Joi.string()
            .max(1)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
            .min(6)
            .required()
    });

    return schema.validate(data);
}

//Login validation
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string()
            .min(6)
            .required() 
    });

    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;