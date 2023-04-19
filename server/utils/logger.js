const winston = require("winston");
const { DailyRotateFile } = require("winston-daily-rotate-file");

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => `${info.timestamp} : ${info.message}`)
);

// transport.on('rotate', function (oldFilename: string, newFilename: string) {
//   // call function like upload to s3 or on cloud
// });

let date = new Date();
let newFilename =
  "-" +
  date.getFullYear() +
  "-" +
  (date.getMonth() + 1).toString().padStart(2, "0") +
  "-" +
  date.getDate().toString().padStart(2, "0") +
  "-" +
  date.getSeconds() +
  ".log";

let logger;
let errorLogger;

const initializeInfoLogger = () => {
  logger = winston.createLogger({
    format: logFormat,
    transports: [
      new winston.transports.File({
        maxsize: 10000000, // size in bytes
        maxFiles: 14, // maximum days to keep file
        zippedArchive: false,
        filename: `log/api${newFilename}`,
        level: "info",
      }),
    ],
  });

  logger.add(
    new winston.transports.Console({
      format: logFormat,
    })
  );
};

const initializeErrorLogger = () => {
  errorLogger = winston.createLogger({
    format: logFormat,
    transports: [
      new winston.transports.File({
        maxsize: 10000000, // size in bytes
        maxFiles: 14, // maximum days to keep file
        zippedArchive: false,
        filename: `log/api-error${newFilename}`,
        level: "error",
      }),
    ],
  });

  errorLogger.add(
    new winston.transports.Console({
      format: logFormat,
    })
  );
};
initializeInfoLogger();
initializeErrorLogger();

module.exports = {
  logger,
  errorLogger,
};

// const { createLogger, transports, format } = require("winston");
// const winston = require("winston");

// const logFormat = winston.format.combine(
//   winston.format.colorize(),
//   winston.format.timestamp(),
//   winston.format.align(),
//   winston.format.printf((info) => `${info.timestamp} : ${info.message}`)
// );

// let date = new Date();
// let newFilename =
//   "-" +
//   date.getFullYear() +
//   "-" +
//   (date.getMonth() + 1).toString().padStart(2, "0") +
//   "-" +
//   date.getDate().toString().padStart(2, "0") +
//   "-" +
//   date.getSeconds() +
//   ".log";

// // Logging function
// const APILogger = createLogger({
//   transports: [
//     new transports.File({
//       filename: `log/api${newFilename}`,
//       level: "info",
//       format: format.combine(format.timestamp(), format.json()),
//     }),
//     new transports.File({
//       filename: `log/api-erro${newFilename}`,
//       level: "error",
//       format: format.combine(format.timestamp(), format.json()),
//     }),
//   ],
// });

// APILogger.add(
//   new winston.transports.Console({
//     format: logFormat,
//   })
// );

// module.exports = APILogger;
