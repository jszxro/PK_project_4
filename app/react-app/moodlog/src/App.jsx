import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { UserProvider } from './context/UserContext';
import { useState } from 'react';
import MainPage from './pages/MainPage';
import PlaylistPage from './pages/PlaylistPage';
import ArchivePage from './pages/ArchivePage';
import MomentsPage from './pages/MomentsPage';
import DiaryPage from './pages/DiaryPage';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<MainPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/playlist" element={<PlaylistPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/moments" element={<MomentsPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/diary" element={<DiaryPage />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
