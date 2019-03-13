import axiosBase from 'axios'
import { toast } from 'react-toastify'

import { baseUrl } from '../util'
import { Router } from '../routes'

const axios = axiosBase.create({ baseURL: baseUrl })

// This is perhaps a bit heavy-handed, but if any of our requests ever come
// back with a 401, we'll just send the user straight to the login screen.
// This should only happen if the user's session expires in the middle of
// them using a page. A possible improvement would be to gracefully prompt
// them to renew their session, but this will be ok for now.
axios.interceptors.response.use(null, err => {
  if (err.response) {
    // Status code outside of 2xx
    if (err.response.status === 401) {
      Router.replaceRoute('login')
    } else {
      const { showErrorToast } = err.config
      if (showErrorToast === undefined || showErrorToast === true) {
        toast.error(err.response.data.message || 'Something went wrong')
      }
    }
  } else {
    // Something happened while setting up the request
    toast.error(err.message)
  }
  return Promise.reject(err)
})

export default axios
