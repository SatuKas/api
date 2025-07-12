const configuration = () => ({
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  logToFile: process.env.LOG_TO_FILE?.toLowerCase() === 'true',
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  // bisa ditambahin config lain di sini
});

export default configuration;
