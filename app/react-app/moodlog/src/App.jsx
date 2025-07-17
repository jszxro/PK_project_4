import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import MainPage from './pages/MainPage';
import PlaylistPage from './pages/PlaylistPage';
import ArchivePage from './pages/ArchivePage';
import MomentsPage from './pages/MomentsPage';  // ✅ 반드시 import
import DiaryPage from './pages/DiaryPage';      // ✅ 반드시 import

import './App.css'

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/playlist" element={<PlaylistPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/moments" element={<MomentsPage />} />   {/* ✅ 추가 */}
            <Route path="/diary" element={<DiaryPage />} />       {/* ✅ 추가 */}
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App;
