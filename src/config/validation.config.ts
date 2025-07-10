import * as Joi from 'joi';

const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  LOG_TO_FILE: Joi.boolean().default(false),
  DATABASE_URL: Joi.string().required(),
});

export default envValidationSchema;
