import axiosBase from 'axios'

import { baseUrl } from '../util'
import { Router } from '../routes'

const axios = axiosBase.create({ baseURL: baseUrl })

axios.interceptors.response.use(null, (err) => {
  if (err.response.status === 401) {
    Router.replaceRoute('login')
  }
  return Promise.reject(err)
})

export default axios
