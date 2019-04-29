import * as Routes from 'next-routes'
import { baseUrl, withBaseUrl } from './util'

// @ts-ignore
const routes = Routes()

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
  .add('adminIndex', withBaseUrl('/admin'))
  .add('adminThemePreview', withBaseUrl('/admin/theme'))

export default routes
export const { Link, Router } = routes
