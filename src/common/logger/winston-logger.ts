import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import 'winston-daily-rotate-file';
import configuration from '../../config/env.config';
import { LoggerEnum } from '../enums/logger/logger.enum';
import {
  loggerFormatter,
  loggerConsoleFormatter,
} from 'src/shared/utils/logger.utils';
export const createWinstonLoggerConfig = () => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: LoggerEnum.LOGGER_TIMESTAMP_FORMAT,
        }),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return loggerConsoleFormatter({
            timestamp: timestamp as string,
            level: level,
            message: message as string,
            context: context as string,
          });
        }),
      ),
    }),
  ];

  if (configuration().logToFile) {
    transports.push(
      new winston.transports.DailyRotateFile({
        dirname: LoggerEnum.DIRNAME,
        filename: LoggerEnum.FILENAME_ERROR,
        datePattern: LoggerEnum.DATE_PATTERN,
        level: LoggerEnum.LOG_FILE_ERROR_LEVEL,
        maxFiles: LoggerEnum.MAX_FILES,
      }),
      new winston.transports.DailyRotateFile({
        dirname: LoggerEnum.DIRNAME,
        filename: LoggerEnum.FILENAME_COMBINED,
        datePattern: LoggerEnum.DATE_PATTERN,
        maxFiles: LoggerEnum.MAX_FILES,
      }),
    );
  }

  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: LoggerEnum.LOGGER_TIMESTAMP_FORMAT }),
      winston.format.printf(({ timestamp, level, message, context }) => {
        return loggerFormatter({
          timestamp: timestamp as string,
          level,
          message: message as string,
          context: context as string,
        });
      }),
    ),
    transports,
  });
};
