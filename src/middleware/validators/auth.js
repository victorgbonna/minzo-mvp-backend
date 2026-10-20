const Joi = require("joi");
const validator = require("./validator");

const registerUserSchema = validator(
  Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),

    email: Joi.string().email().required(),

    phone: Joi.string().required(),
  })
);
const loginUserSchema = validator(
  Joi.object({
    identifier:Joi.string().required(),
    password:Joi.string().required(),
  })
);

const registerUserAndBusinessSchema = validator(
  Joi.object({
    name:Joi.string().required(),
    password:Joi.string().required(),
    //enable strong passsword validation later on..
    email: Joi.string().email().required(),
    phone: Joi.string().required(),

    //business details
    businessName:Joi.string().required(),
    businessEmail:Joi.string().email().required(),
    businessPhone:Joi.string().required(),
    address:Joi.string().required(),
    county:Joi.string().required(),
    city:Joi.string().required(),
    type:Joi.string().required(),
    description:Joi.string().optional(),
    longitude:Joi.number().optional(),
    latitude:Joi.number().optional(),
    website:Joi.string().uri().optional(),
    openingHours:Joi.any().optional(),
    registrationDocumentUrl:Joi.string().uri().required(),
    doctors:Joi.array().items(Joi.string()).optional(),
    headNurse:Joi.string().optional(),
    services:Joi.array().items(Joi.string()).optional(),
  // })
  })
);


module.exports = {registerUserSchema, loginUserSchema, registerUserAndBusinessSchema};
  