import  Joi from 'joi';

const itemSchema = Joi.object({
  bookName: Joi.string().min(6).max(255).required().messages({
    'string.min': 'Book name must be at least 6 characters long',
    'string.max': 'Book name cannot exceed 255 characters',
    'any.required': 'Book name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  })
});


export default itemSchema;