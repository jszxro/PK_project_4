import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { useState } from 'react'; // ✅ 추가
import MainPage from './pages/MainPage';
import PlaylistPage from './pages/PlaylistPage';
import ArchivePage from './pages/ArchivePage';
import MomentsPage from './pages/MomentsPage';
import DiaryPage from './pages/DiaryPage';


import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ 로그인 상태 선언

  return (
  <UserProvider>
    <BrowserRouter>
      <Routes>
        {/* ✅ 로그인 상태를 MainPage에 props로 전달 */}
        <Route path="/" element={<MainPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/playlist" element={<PlaylistPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/moments" element={<MomentsPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/diary" element={<DiaryPage />} />
      </Routes>
    </BrowserRouter>
  </UserProvider>
  );

}

export default App;
