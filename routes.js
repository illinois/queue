const routes = require('next-routes')()

routes
  .add('index', '/')
  .add('queue', '/queue/:id')
  .add('createCourse', '/course/create')
  .add('course', '/course/:id')
  .add('createQueue', '/course/:courseId/queue/create')

module.exports = routes
