import axios from 'axios'

const axiosInstance = axios.create({
    // baseURL : import.meta.env.VITE_API_BASE 
    baseURL : `http://localhost:5000`
})

const useAxios = () => {
  return axiosInstance;
}

export default useAxios