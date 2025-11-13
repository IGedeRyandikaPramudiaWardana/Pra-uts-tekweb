import axios from "axios"; 

const token = localStorage.getItem("token"); 
// const token = "7|bOtnwmmtJLUq7tkGTzZgnlABHn9Ni2jM9Am27fEy5c23354d"; 



const apiClient = axios.create({ 
        baseURL: "http://127.0.0.1:8000/api", 
        headers: { 
            "Content-Type": "application/json", 
            Accept: "application/json", 
            Authorization: token ? `Bearer ${token}` : "", 
     }, 
});


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
    
export default apiClient; 