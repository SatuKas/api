import { LoggerFormatData, LoggerMessageData } from 'src/types/logger.type';

export const loggerMessageFormater = (data: LoggerMessageData) => {
  return JSON.stringify(data);
};

export const loggerFormatter = (data: LoggerFormatData) => {
  return `[${data.timestamp}][${data.level.toUpperCase()}]${data.context ? '[' + data.context + ']' : ''}[${data.message}]`;
};

export const loggerConsoleFormatter = (data: LoggerFormatData) => {
  const levelColors = {
    info: '\x1b[32m', // green
    warn: '\x1b[33m', // yellow
    error: '\x1b[31m', // red
    debug: '\x1b[36m', // cyan
  };

  const reset = '\x1b[0m';
  const yellow = '\x1b[33m';
  const italic = '\x1b[3m';

  const levelColor = levelColors[data.level.toLowerCase()] || reset;

  return `[${italic}${data.timestamp}${reset}][${levelColor}${data.level.toUpperCase()}${reset}]${data.context ? `${yellow}[${data.context}]${reset}` : ''} ${data.message}`;
};
