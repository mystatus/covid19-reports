import util, { InspectOptions } from 'util';
import winston from 'winston';
import ansiColors from 'ansi-colors';

const logColors = {
  levels: {
    error: ansiColors.red,
    warn: ansiColors.yellow,
    test: ansiColors.magenta,
  },
  elements: {
    timestamp: ansiColors.gray,
  },
};

const winstonFormatLog = winston.format.printf(info => {
  // Format the message.
  let message = info.message;

  if (info.metadata.data !== undefined) {
    // If a data object was passed in as a second argument, pretty print it after the message.
    const formattedData = util.inspect(info.metadata.data, {
      showHidden: false,
      colors: true,
      compact: false,
      depth: 6,
      ...info.metadata.inspectOptions,
    });
    message += `\n${formattedData}`;
  }

  // Colorize log elements.
  const levelColor = Reflect.get(logColors.levels, info.level) as ansiColors.StyleFunction | undefined;
  if (levelColor) {
    message = levelColor(message);
  }

  const timestamp = logColors.elements.timestamp(info.timestamp);

  // Output formatted log.
  return `[${timestamp}] ${message}`;
});

const winstonLogger = winston.createLogger({
  levels: {
    test: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    winston.format.splat(),
    winstonFormatLog,
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL ?? 'debug',
    }),
  ],
});

function messageToString(message: any): string {
  if (message instanceof Error) {
    return message.stack ?? message.message;
  }

  return `${message}`;
}

export const Log = {
  test(message: any, data?: any, inspectOptions?: InspectOptions) {
    (winstonLogger as any).test(messageToString(message), { data, inspectOptions });
  },

  error(message: any, data?: any, inspectOptions?: InspectOptions) {
    winstonLogger.error(messageToString(message), { data, inspectOptions });
  },

  warn(message: any, data?: any, inspectOptions?: InspectOptions) {
    winstonLogger.warn(messageToString(message), { data, inspectOptions });
  },

  info(message: any, data?: any, inspectOptions?: InspectOptions) {
    winstonLogger.info(messageToString(message), { data, inspectOptions });
  },

  debug(message: any, data?: any, inspectOptions?: InspectOptions) {
    winstonLogger.debug(messageToString(message), { data, inspectOptions });
  },
};
