import axios from 'axios'

const API_HOST = 'http://localhost:9000/api'
// create an axios instance
const service = axios.create({
  baseURL: API_HOST, // api 的 base_url
  timeout: 100000 // request timeout, milliseconds
})

service.interceptors.response.use(
  response => response,
  error => {
    console.log('错误代码：' + error.response.status + '，错误详情：' + error.response.data.data)
    return Promise.reject(error)
  }
)

export default service
