export enum LoggerEnum {
  MAX_FILES = '7d',
  MAX_SIZE = '10m',
  LOG_FILE_INFO_LEVEL = 'info',
  LOG_FILE_ERROR_LEVEL = 'error',
  DIRNAME = 'logs',
  FILENAME_COMBINED = '%DATE%-combined.log',
  FILENAME_ERROR = '%DATE%-error.log',
  DATE_PATTERN = 'YYYY-MM-DD',
  LEVEL = 'info',
  FORMAT = 'json',
  HTTP = 'HTTP',
  LOGGER_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss',
}
