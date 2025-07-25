import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ 렌더링 보류용 추가

    // ✅ 앱 시작 시 forceLogout 체크
    useEffect(() => {
        const wasForceLoggedOut = localStorage.getItem("forceLogout");

        if (wasForceLoggedOut === "true") {
            localStorage.removeItem("forceLogout");      // 플래그 제거
            setUserInfo(null);                          // 전역 상태 초기화
            setLoading(false);                          // 렌더링 가능 상태로 전환
            return;
        }

        // 서버에 로그인 여부 확인
        axios.get('/api/user-info', { withCredentials: true })
            .then(res => setUserInfo(res.data))
            .catch(() => setUserInfo(null))
            .finally(() => setLoading(false));          // ✅ 응답 후 렌더링 허용
    }, []);

    // 🔍 디버그 로그
    useEffect(() => {
        if (userInfo) {
            console.log("로그인정보", userInfo);
        }
    }, [userInfo]);

    // 로그아웃 함수
    const logout = () => {
        axios.post('/api/logout', {}, { withCredentials: true })
            .then(() => setUserInfo(null))
            .catch(err => console.error('Logout failed:', err));
    };

    // ✅ 탭 닫을 때 로그아웃
    useEffect(() => {
        const tabId = Date.now().toString();
        sessionStorage.setItem("tabId", tabId);

        const handleBeforeUnload = () => {
            const navType = performance.getEntriesByType("navigation")[0]?.type;
            if (navType !== "reload") {
                localStorage.setItem("forceLogout", "true"); // 다음 진입 시 로그아웃 처리
                navigator.sendBeacon("/api/logout");
                sessionStorage.removeItem("tabId");
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    // ✅ 로그인 여부 파악 전엔 렌더링 보류
    if (loading) return null;

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
};