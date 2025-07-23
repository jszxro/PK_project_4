// import '../App.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import LoginModal from '../components/LoginModal';
// import styles from '../assets/css/PlaylistPage.module.css'; // ✅ CSS 모듈 import
// import axios from 'axios';

// function PlaylistPage({ isLoggedIn, setIsLoggedIn }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedTag, setSelectedTag] = useState('행복');
//   const [emojiList, setEmojiList] = useState([]);
//   const [songs, setSongs] = useState([]);

//   useEffect(() => {
//     axios.get('/api/emojis')
//       .then(response => setEmojiList(response.data))
//       .catch(error => console.error('이모지 목록 불러오기 실패:', error));
//   }, []);

//   useEffect(() => {
//     axios.get(`/api/songs/${encodeURIComponent(selectedTag)}`)
//       .then(res => setSongs(res.data))
//       .catch(err => console.error('노래 목록 불러오기 실패:', err));
//   }, [selectedTag]);

//   return (
//     <div className={styles.playlistLayout}>
//       <div className={styles.mainContent}>


//         <div className={styles.tagContainer}>
//           <h4 className={styles.sectionTitle}>오늘 기분에 어울리는 곡을 찾아드릴게요</h4>
//           <div className={styles.tags}>
//             {emojiList.map(({ emojiId, tag }) => (
//               <button
//                 key={emojiId}
//                 className="tag-btn"
//                 onClick={() => { setSelectedTag(tag), console.log(tag) }}
//               >
//                 # {emojiId}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className={styles.playlistArea}>
//           {songs.map((song, idx) => (
//             <div className={styles.playlistCard} key={idx}>
//               {song.title} - {song.artist}
//             </div>
//           ))}
//         </div>

//       </div>

//       {showModal && <LoginModal onClose={() => setShowModal(false)} />}
//     </div>
//   );
// }

// export default PlaylistPage;
