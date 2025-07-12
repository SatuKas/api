import { Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LoggerEnum } from '../enums/logger/logger.enum';
import {
  loggerFormatter,
  loggerConsoleFormatter,
} from 'src/shared/utils/logger.utils';
import configuration from 'src/config/env.config';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private logger: winston.Logger;
  private context = '';

  constructor() {
    this.logger = winston.createLogger({
      level: LoggerEnum.LOG_FILE_INFO_LEVEL,
      format: winston.format.combine(
        winston.format.timestamp({
          format: LoggerEnum.LOGGER_TIMESTAMP_FORMAT,
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return loggerFormatter({
            timestamp: timestamp as string,
            level,
            message: message as string,
            context: this.context,
          });
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: LoggerEnum.LOGGER_TIMESTAMP_FORMAT,
            }),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return loggerConsoleFormatter({
                timestamp: timestamp as string,
                level,
                message: message as string,
                context: (context as string) || this.context,
              });
            }),
          ),
        }),
        ...(configuration().logToFile
          ? [
              new DailyRotateFile({
                dirname: LoggerEnum.DIRNAME,
                filename: LoggerEnum.FILENAME_COMBINED,
                datePattern: LoggerEnum.DATE_PATTERN,
                zippedArchive: false,
                maxSize: LoggerEnum.MAX_SIZE,
                maxFiles: LoggerEnum.MAX_FILES,
                level: LoggerEnum.LOG_FILE_INFO_LEVEL,
              }),
            ]
          : []),
        ...(configuration().logToFile
          ? [
              new DailyRotateFile({
                dirname: LoggerEnum.DIRNAME,
                filename: LoggerEnum.FILENAME_ERROR,
                datePattern: LoggerEnum.DATE_PATTERN,
                maxSize: LoggerEnum.MAX_SIZE,
                maxFiles: LoggerEnum.MAX_FILES,
                level: LoggerEnum.LOG_FILE_ERROR_LEVEL,
              }),
            ]
          : []),
      ],
    });
  }

  private formatMessage(message: any): string {
    return typeof message === 'string'
      ? message
      : JSON.stringify(message, null, 2);
  }

  setContext(context: string) {
    this.context = context;
  }

  info(message: any) {
    this.logger.info(this.formatMessage(message));
  }

  warn(message: any) {
    this.logger.warn(this.formatMessage(message));
  }

  error(message: any) {
    this.logger.error(this.formatMessage(message));
  }

  debug(message: any) {
    this.logger.debug(this.formatMessage(message));
  }

  log(level: string, message: any) {
    this.logger.log(level, this.formatMessage(message));
  }
}
