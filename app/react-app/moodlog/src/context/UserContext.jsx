import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        axios.get('/api/user-info', { withCredentials: true })
            .then(res => {
                setUserInfo(res.data);
            })
            .catch(() => {
                setUserInfo(null);
            });
    }, []);

    useEffect(() => {
        if (userInfo) {
            console.log("로그인정보", userInfo);
        }
    }, [userInfo]);

    const logout = () => {
        axios.post('/api/logout', {}, { withCredentials: true })
            .then(() => setUserInfo(null))
            .catch(err => console.error('Logout failed:', err));
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
};
