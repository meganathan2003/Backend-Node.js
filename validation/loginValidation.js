/**
 * Below the code for using the module for
 * writing the validation for data joi is the 
 * best npm package for validate the users or other
 * data
 * @import(joi)
 * 
 */
const Joi = require('joi');

// Define a schema for the user Data
const userSchema = Joi.object({
    email:  Joi.string().email().required(),
    password: Joi.string().alphanum().min(3).max(30).required()
});

module.exports = userSchema;