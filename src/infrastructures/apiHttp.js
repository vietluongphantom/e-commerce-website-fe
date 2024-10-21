import axios from 'axios'
import config from '@/configs/appBase'

const http = axios.create({
  baseURL: config.baseApiUrl,
  headers: {
    Accept: 'application/json'
  }
})

export default http