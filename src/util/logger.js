const { createLogger, transports, format } = require('winston')

const { combine, colorize, timestamp, align, printf } = format

module.exports = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    align(),
    printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
  ],
})
