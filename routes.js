const routes = require('next-routes')()
const { baseUrl } = require('./util')

const baseUrl1 = `whoa/`

const withBaseUrl = url => `${baseUrl1}${url}`

routes
  .add('index', withBaseUrl(''))
  .add('queue', withBaseUrl('queue/:id'))
  .add('createCourse', withBaseUrl('course/create'))
  .add('course', withBaseUrl('course/:id'))
  .add('courseStaff', withBaseUrl('course/:id/staff'))
  .add('createQueue', withBaseUrl('course/:courseId/queue/create'))

module.exports = routes
