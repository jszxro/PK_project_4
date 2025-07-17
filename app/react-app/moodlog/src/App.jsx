import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import PlaylistPage from './pages/PlaylistPage';
import ArchivePage from './pages/ArchivePage'; 
import MomentsPage from './pages/MomentsPage';  // ✅ 반드시 import
import DiaryPage from './pages/DiaryPage';      // ✅ 반드시 import

import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/moments" element={<MomentsPage />} />   {/* ✅ 추가 */}
          <Route path="/diary" element={<DiaryPage />} />       {/* ✅ 추가 */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
