import axiosBase from 'axios'

import { baseUrl } from '../util'
import { Router } from '../routes'

const axios = axiosBase.create({ baseURL: baseUrl })

// This is perhaps a bit heavy-handed, but if any of our requests ever come
// back with a 401, we'll just send the user straight to the login screen.
// This should only happen if the user's session expires in the middle of
// them using a page. A possible improvement would be to gracefully prompt
// them to renew their session, but this will be ok for now.
axios.interceptors.response.use(null, err => {
  if (err.response.status === 401) {
    Router.replaceRoute('login')
  }
  return Promise.reject(err)
})

export default axios
