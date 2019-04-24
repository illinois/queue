import { createLogger, transports, format } from 'winston'
import { inspect } from 'util'

const { combine, colorize, timestamp, errors, splat } = format

const outputFormat = format.printf(info => {
  const formattedMessage =
    typeof info.message === 'string' ? info.message : inspect(info.message)
  const message = info.stack || formattedMessage
  return `${info.timestamp} [${info.level}]: ${message}`
})

const logger = createLogger({
  format: combine(
    errors({ stack: true }),
    colorize(),
    timestamp(),
    splat(),
    outputFormat
  ),
  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
  ],
})

export { logger }
