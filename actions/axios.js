import axios from 'axios'

import { baseUrl } from '../util'

export default axios.create({ baseURL: baseUrl })
