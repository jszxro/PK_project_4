import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);


    // 로그인 여부 확인
    useEffect(() => {
        axios.get('/api/user-info', { withCredentials: true })
            .then(res => {
                setUserInfo(res.data);
            })
            .catch(() => {
                setUserInfo(null);
            });
    }, []);

    // 로그인 정보 확인 로그 
    useEffect(() => {
        if (userInfo) {
            console.log("로그인정보", userInfo);
        }
    }, [userInfo]);


    // 로그아웃 
    const logout = () => {
        axios.post('/api/logout', {}, { withCredentials: true })
            .then(() => setUserInfo(null))
            .catch(err => console.error('Logout failed:', err));
    };

    // 탭 닫을 때 로그아웃 (단일 탭만 제어)
    useEffect(() => {
        sessionStorage.setItem("activeTab", "true");

        const handleUnload = () => {
            sessionStorage.removeItem("activeTab");
            navigator.sendBeacon("/api/logout");
        };

        window.addEventListener("unload", handleUnload);

        return () => {
            window.removeEventListener("unload", handleUnload);
        };
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
};
