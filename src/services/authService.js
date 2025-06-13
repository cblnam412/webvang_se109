import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Đăng ký
const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Đăng nhập
const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);

    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Đăng xuất
const logout = () => {
    localStorage.removeItem('user');
};

export default {
    register,
    login,
    logout
};