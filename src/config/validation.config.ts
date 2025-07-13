import * as Joi from 'joi';

const envValidationSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  LOG_TO_FILE: Joi.boolean().default(false),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_EMAIL_SECRET: Joi.string().required(),
  VERIFICATION_PROCESS_VIA: Joi.string()
    .valid('frontend', 'backend')
    .required(),
  FRONTEND_URL: Joi.string().required(),
  BACKEND_URL: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_USERNAME: Joi.string(),
  REDIS_PASSWORD: Joi.string(),
  MAIL_DRIVER: Joi.string().valid('smtp', 'resend').required(),
  SMTP_HOST: Joi.string(),
  SMTP_PORT: Joi.number(),
  SMTP_FROM: Joi.string(),
  SMTP_USERNAME: Joi.string(),
  SMTP_PASSWOD: Joi.string(),
  RESEND_API_URL: Joi.string(),
  RESEND_FROM: Joi.string(),
  RESEND_API_KEY: Joi.string(),
});

export default envValidationSchema;
