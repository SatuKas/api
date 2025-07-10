export type LoggerMessageData = {
  method?: string;
  endpoint?: string;
  statusCode?: number;
  responseTime?: string;
  request?: any;
  response?: any;
};

export type LoggerFormatData = {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
};
