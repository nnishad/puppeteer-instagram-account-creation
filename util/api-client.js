import axios from 'axios'
import logger from './custom-logger.js'

// Axios utility
const axiosInstance = axios.create({
  // Add any custom configuration here
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify config or add headers if needed
    return config
  },
  (error) => {
    // Handle request error
    logger.error('Request error:' + error.message)
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Process response data if needed
    return response
  },
  (error) => {
    // Handle response error
    logger.error('Response error:' + error.message)
    return Promise.reject(error)
  }
)

// Utility functions
const apiClient = {
  get: async (url, config) => {
    try {
      const response = await axiosInstance.get(url, config)
      return response.data
    } catch (error) {
      throw new Error(`GET request to ${url} failed: ${error.message}`)
    }
  },

  post: async (url, data, config) => {
    try {
      const response = await axiosInstance.post(url, data, config)
      return response.data
    } catch (error) {
      throw new Error(`POST request to ${url} failed: ${error.message}`)
    }
  },

  put: async (url, data, config) => {
    try {
      const response = await axiosInstance.put(url, data, config)
      return response.data
    } catch (error) {
      throw new Error(`PUT request to ${url} failed: ${error.message}`)
    }
  },

  delete: async (url, config) => {
    try {
      const response = await axiosInstance.delete(url, config)
      return response.data
    } catch (error) {
      throw new Error(`DELETE request to ${url} failed: ${error.message}`)
    }
  }
}

export default apiClient
