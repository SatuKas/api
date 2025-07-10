import { LoggerFormatData, LoggerMessageData } from 'src/types/logger.type';

export const loggerMessageFormater = (data: LoggerMessageData) => {
  return JSON.stringify(data);
};

export const loggerFormatter = (data: LoggerFormatData) => {
  return `[${data.timestamp}][${data.level.toUpperCase()}]${data.context ? '[' + data.context + ']' : ''}[${data.message}]`;
};
