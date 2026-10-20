const Joi = require("joi");
const validator = require("./validator");

const claimBusinessSchema = validator(
  Joi.object({
    // userId:Joi.string().required(),
    businessId:Joi.string().required(),
    proof:Joi.object({
        registrationDocumentUrl:Joi.string().uri().required()
    }).required(),
  })
);

const submitARatingSchema=validator(
  Joi.object({
    businessId:Joi.string().required(),
    userId:Joi.string().required(),
    rating:Joi.number().min(1).max(5).required(),
    comment:Joi.string().required(),
    isAnonymous:Joi.boolean().optional(),
  })
);

module.exports = {claimBusinessSchema, submitARatingSchema};
  