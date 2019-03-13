const routes = require('next-routes')()
const { baseUrl, withBaseUrl } = require('./util')

// We need to special-case the index route. When running with a non-empty
// base URL, for instance /foo, we'll fail to resolve /foo if the index URL
// ends with a slash. However, when running locally with an empty base URL,
// we need the root route to be "/" for it to be resolved properly.
if (baseUrl === '') {
  routes.add('index', '/')
} else {
  routes.add('index', withBaseUrl(''))
}
routes
  .add('login', withBaseUrl('/login'))
  .add('queue', withBaseUrl('/queue/:id'))
  .add('queueSettings', withBaseUrl('/queue/:id/settings'))
  .add('createCourse', withBaseUrl('/course/create'))
  .add('course', withBaseUrl('/course/:id'))
  .add('courseStaff', withBaseUrl('/course/:id/staff'))
  .add('createQueue', withBaseUrl('/course/:courseId/queue/create'))
  .add('userSettings', withBaseUrl('/settings'))

module.exports = routes
