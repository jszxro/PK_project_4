import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PlaylistPage from './pages/PlaylistPage';
import ArchivePage from './pages/ArchivePage'; 
import WritePost from './pages/WritePost';

import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
           <Route path="/" element={<MainPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/post" element={<WritePost/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
