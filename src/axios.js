import axios from "axios";

const API_URL = "https://todo-5gkm.onrender.com/api/todos";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: false
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
        // Add any request headers here
        config.headers['Access-Control-Allow-Origin'] = '*';
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        return Promise.reject(error);
    }
);

export const fetchTodo = async () => {
    try {
        const response = await axiosInstance.get("/");
        return response.data;
    } catch (err) {
        console.error("Error fetching todos: ", err.response?.data || err.message);
        throw err;
    }
}

export const createTodo = async (taskData) => {
    try {
        const response = await axiosInstance.post("/", taskData);
        return response.data;
    } catch (err) {
        console.error("Error creating todo: ", err.response?.data || err.message);
        throw err;
    }
}

export const updateTodo = async (id, updates) => {
    try {
        const response = await axiosInstance.put(`/${id}`, updates);
        return response.data;
    } catch (err) {
        console.error("Error updating todo: ", err.response?.data || err.message);
        throw err;
    }
}

export const deleteTodo = async (id) => {
    try {
        await axiosInstance.delete(`/${id}`);
    } catch (err) {
        console.error("Error deleting todo: ", err.response?.data || err.message);
        throw err;
    }
}

export const fetchOverdueTodos = async () => {
    try {
        const response = await axiosInstance.get("/overdue");
        return response.data;
    } catch (err) {
        console.error("Error fetching overdue todos: ", err.response?.data || err.message);
        throw err;
    }
}

export default axiosInstance;
