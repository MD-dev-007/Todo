import axios from "axios";

const API_URL = "http://localhost:5000/api/todos/";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

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
