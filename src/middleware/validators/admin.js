const Joi = require("joi");
const validator = require("./validator");

const registerAdminSchema = validator(
  Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),

    email: Joi.string().email(),
    phone: Joi.string(),
  })
);
const loginAdminSchema = validator(
  Joi.object({
    identifier:Joi.string().required(),
    password:Joi.string().required(),
  })
);

const reviewRatingSchema=validator(
  Joi.object({
    businessId:Joi.string().required(),
    userId:Joi.string().required(),
    approvalStatus:Joi.string().valid('approved', 'rejected').required(),
    //comment added in p1 priority
    comment:Joi.string().optional(),

  })
);

const reviewBusinessVerificationSchema = validator(
  Joi.object({
    businessId:Joi.string().required(),
    approvalStatus:Joi.string().valid('approved', 'rejected').required(),
  })
);
module.exports = {registerAdminSchema, loginAdminSchema, reviewRatingSchema, reviewBusinessVerificationSchema};
  