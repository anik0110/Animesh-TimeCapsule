import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
      setUser({ token }); 
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    setToken(res.data.token);
  };

  const register = async (username, email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
    setToken(res.data.token);
  };

  const logout = () => setToken(null);

  const googleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential
      });
      
      setToken(res.data.token);
    } catch (err) {
      console.error("Google Login Failed", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};