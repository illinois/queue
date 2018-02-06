import axios from 'axios'

const baseURL = (typeof window !== 'undefined' && window.API_BASE)
|| (typeof process !== 'undefined' && process.env.ASSET_PREFIX)
|| '/'

export default axios.create({ baseURL })
