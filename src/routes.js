const routes = require('next-routes')()
const { withBaseUrl } = require('./util')

routes
  .add('index', withBaseUrl(''))
  .add('queue', withBaseUrl('queue/:id'))
  .add('createCourse', withBaseUrl('course/create'))
  .add('course', withBaseUrl('course/:id'))
  .add('courseStaff', withBaseUrl('course/:id/staff'))
  .add('createQueue', withBaseUrl('course/:courseId/queue/create'))
  .add('userSettings', withBaseUrl('settings'))

module.exports = routes
