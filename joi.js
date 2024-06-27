const Joi = require("joi");

const listingSchemaValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow(""),           
    price: Joi.number().required().min(0),   
    country: Joi.string().required(),
    location: Joi.string().required()
}).required();

//Review validation
const reviewSchemaValidation = Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required(),
}).required();

module.exports ={listingSchemaValidation,reviewSchemaValidation};