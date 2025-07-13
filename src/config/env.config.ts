const configuration = () => ({
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  logToFile: process.env.LOG_TO_FILE?.toLowerCase() === 'true',
  appName: process.env.APP_NAME || 'My Cool App',
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  redisUsername: process.env.REDIS_USERNAME,
  redisPassword: process.env.REDIS_PASSWORD,
  mailDriver: process.env.MAIL_DRIVER || 'resend',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT ?? '587', 10),
  smtpFrom: process.env.SMTP_FROM,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
  resendApiUrl: process.env.RESEND_API_URL || 'https://api.resend.com/emails',
  resendFrom: process.env.RESEND_FROM,
  resendApiKey: process.env.RESEND_API_KEY,
});

export default configuration;
