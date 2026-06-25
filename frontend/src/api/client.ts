import axios from "axios"


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

apiClient.interceptors.request.use((config) => {

    const token = localStorage.getItem("token")
  
    if (token && config.headers) {
      config.headers.Authorization = 
      `Bearer ${token}`
    }
  
    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
  
    (error) => {
  
      const requestUrl = error.config?.url ?? ""
      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register")

      if (
        error.response?.status === 401 &&
        !isAuthRequest
      ) {
  
        localStorage.removeItem("token")
  
        window.location.href = "/login"
      }
  
      return Promise.reject(error)
    }
  )

export default apiClient