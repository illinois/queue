/**
 * Allows us to safely handle errors in async code without wrapping each route
 * handler in a try...catch block.
 */
module.exports = fn => {
  return (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
}
