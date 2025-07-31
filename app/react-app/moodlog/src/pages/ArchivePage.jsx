import '../App.css'; // 혹시 공통 스타일이 있다면 유지
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import LoginModal from '../components/LoginModal';
import CalendarBox from '../components/CalendarBox';
import styles from '../assets/css/ArchivePage.module.css';
import diaryStyles from '../assets/css/DiaryPage.module.css';
import { UserContext } from '../context/UserContext';

function ArchivePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [dateEmojis, setDateEmojis] = useState({});
  const [diaryList, setDiaryList] = useState([]);
  const [postList, setPostList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [emojiList, setEmojiList] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 오늘 날짜 구하기
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  // 페이지 로드 시 일기 데이터 가져오기
  useEffect(() => {
    const loadDiaryData = async () => {
      const userKey = userInfo?.userKey || localStorage.getItem('userKey');
      if (!userKey) return;

      try {
        const response = await axios.get(`/api/diaries/user/${userKey}`);
        const diaries = response.data;

        setDiaryList(diaries);

        // 일기 데이터를 날짜별 이모지 형태로 변환
        const emojiData = {};
        diaries.forEach(diary => {
          if (diary.createdAt && diary.emoji) {
            const dateKey = diary.createdAt.split('T')[0];
            emojiData[dateKey] = diary.emoji;
          }
        });

        setDateEmojis(emojiData);
        // console.log('로드된 일기 데이터:', diaries);
        // console.log('변환된 이모지 데이터:', emojiData);
      } catch (error) {
        console.error('일기 데이터 로드 실패:', error);
      }
    };

    const loadPostData = async () => {
      const userKey = userInfo?.userKey || localStorage.getItem('userKey');
      if (!userKey) return;

      try {
        const response = await axios.get(`/api/posts`);
        // 현재 사용자가 작성한 POST만 필터링
        const userPosts = response.data.filter(post => post.userKey === userKey);
        setPostList(userPosts);
      } catch (error) {
        console.error('POST 데이터 로드 실패:', error);
      }
    };

    const loadCommentData = async () => {
      const userKey = userInfo?.userKey || localStorage.getItem('userKey');
      if (!userKey) return;

      try {
        const response = await axios.get(`/api/comments/user/${userKey}`);
        setCommentList(response.data);
      } catch (error) {
        console.error('댓글 데이터 로드 실패:', error);
        setCommentList([]); // 실패 시 빈 배열로 설정
      }
    };

    loadDiaryData();
    loadPostData();
    loadCommentData();
  }, [userInfo]);

  // 페이지가 포커스될 때마다 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      const userKey = userInfo?.userKey || localStorage.getItem('userKey');
      if (!userKey) return;

      // 일기 데이터 다시 로드
      axios.get(`/api/diaries/user/${userKey}`)
        .then(response => {
          const diaries = response.data;
          setDiaryList(diaries);

          // 일기 데이터를 날짜별 이모지 형태로 변환
          const emojiData = {};
          diaries.forEach(diary => {
            if (diary.createdAt && diary.emoji) {
              const dateKey = diary.createdAt.split('T')[0];
              emojiData[dateKey] = diary.emoji;
            }
          });
          setDateEmojis(emojiData);
        })
        .catch(error => console.error('일기 데이터 새로고침 실패:', error));

      // POST 데이터 다시 로드
      axios.get(`/api/posts`)
        .then(response => {
          const userKey = userInfo?.userKey || localStorage.getItem('userKey');
          if (userKey) {
            // 현재 사용자가 작성한 POST만 필터링
            const userPosts = response.data.filter(post => post.userKey === userKey);
            setPostList(userPosts);
          }
        })
        .catch(error => console.error('POST 데이터 새로고침 실패:', error));

      // 댓글 데이터 다시 로드
      const currentUserKey = userInfo?.userKey || localStorage.getItem('userKey');
      if (currentUserKey) {
        axios.get(`/api/comments/user/${currentUserKey}`)
          .then(response => {
            setCommentList(response.data);
          })
          .catch(error => {
            console.error('댓글 데이터 새로고침 실패:', error);
            setCommentList([]);
          });
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [userInfo]);

  // 페이지 진입 시 상태 확인 (일기 작성 후 돌아온 경우)
  useEffect(() => {
    if (location.state?.refreshData) {
      const userKey = userInfo?.userKey || localStorage.getItem('userKey');
      if (userKey) {
        // 일기 새로고침
        axios.get(`/api/diaries/user/${userKey}`)
          .then(response => {
            const diaries = response.data;
            setDiaryList(diaries);

            const emojiData = {};
            diaries.forEach(diary => {
              if (diary.createdAt && diary.emoji) {
                const dateKey = diary.createdAt.split('T')[0];
                emojiData[dateKey] = diary.emoji;
              }
            });
            setDateEmojis(emojiData);
          })
          .catch(error => console.error('일기 데이터 새로고침 실패:', error));

        // POST 새로고침
        axios.get(`/api/posts`)
          .then(response => {
            const userKey = userInfo?.userKey || localStorage.getItem('userKey');
            if (userKey) {
              // 본인 작성한 것만
              const userPosts = response.data.filter(post => post.userKey === userKey);
              setPostList(userPosts);
            }
          })
          .catch(error => console.error('POST 데이터 새로고침 실패:', error));

        // 댓글 새로고침
        const refreshUserKey = userInfo?.userKey || localStorage.getItem('userKey');
        if (refreshUserKey) {
          axios.get(`/api/comments/user/${refreshUserKey}`)
            .then(response => {
              setCommentList(response.data);
            })
            .catch(error => {
              console.error('댓글 데이터 새로고침 실패:', error);
              setCommentList([]);
            });
        }
      }

      // 상태 초기화
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, userInfo, navigate]);

  useEffect(() => {
    setImageLoading(false);
    setImageError(false);

    if (selectedDiary?.imgUrl) {
      const img = new Image();
      const imageUrl = selectedDiary.imgUrl.startsWith('http')
        ? selectedDiary.imgUrl
        : `http://bjava.iptime.org:8340${selectedDiary.imgUrl}`;

      setImageLoading(true);

      img.onload = () => {
        setImageLoading(false);
        setImageError(false);
      };

      img.onerror = () => {
        setImageLoading(false);
        setImageError(true);
      };

      img.src = imageUrl;
    }
  }, [selectedDiary]);

  // 이모지 목록 로드
  useEffect(() => {
    axios.get('/api/emojis')
      .then(response => setEmojiList(response.data))
      .catch(error => console.error('이모지 목록 불러오기 실패:', error));
  }, []);

  // 감정 통계 계산
  const calculateEmotionStats = () => {
    const emotionCount = {};
    const totalDays = Object.keys(dateEmojis).length;

    Object.values(dateEmojis).forEach(emoji => {
      emotionCount[emoji] = (emotionCount[emoji] || 0) + 1;
    });

    const mostFrequentEmotion = Object.entries(emotionCount)
      .sort((a, b) => b[1] - a[1])[0];

    // 최대 감정 & 횟수 (중복 횟수 감정도 적용)
    const maxCount = mostFrequentEmotion ? mostFrequentEmotion[1] : 0;
    const topEmotions = Object.entries(emotionCount)
      .filter(([emoji, count]) => count === maxCount)
      .map(([emoji, count]) => emoji);

    // 현재 달의 총 일수 계산
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 0부터 시작하므로 +1
    const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();

    return {
      emotionCount,
      totalDays,
      mostFrequentEmotion: mostFrequentEmotion ? mostFrequentEmotion[0] : null,
      mostFrequentCount: mostFrequentEmotion ? mostFrequentEmotion[1] : 0,
      topEmotions,
      daysInCurrentMonth
    };
  };

  const emotionStats = calculateEmotionStats();

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.error('이미지 로딩 실패:', e.target.src);
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
    setImageError(false);
  };

  // 다이어리 수정
  const handleEditDiary = (diary) => {
    navigate('/diary', {
      state: {
        editingDiary: diary,
        selectedDate: diary.createdAt,
        fromArchive: true
      }
    });
  };

  // 다이어리 삭제
  const handleDeleteDiary = async (diaryId) => {
    // console.log('삭제하려는 다이어리 ID:', diaryId);
    // console.log('선택된 다이어리 데이터:', selectedDiary);

    if (!window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`/api/diaries/${diaryId}`);

      // 삭제 성공 -> 새로고침
      const userKey = userInfo?.userKey || localStorage.getItem('userKey');
      if (userKey) {
        const response = await axios.get(`/api/diaries/user/${userKey}`);
        const diaries = response.data;
        setDiaryList(diaries);

        // 날짜별 이모지 데이터 업데이트
        const emojiData = {};
        diaries.forEach(diary => {
          if (diary.createdAt && diary.emoji) {
            const dateKey = diary.createdAt.split('T')[0];
            emojiData[dateKey] = diary.emoji;
          }
        });
        setDateEmojis(emojiData);

        // 선택된 다이어리 초기화
        setSelectedDiary(null);
      }

      alert('일기가 삭제되었습니다.');

    } catch (error) {
      console.error('일기 삭제 실패:', error);
      if (error.response?.status === 404) {
        alert('삭제하려는 일기를 찾을 수 없습니다.');
      } else {
        alert('일기 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }; return (
    <div className="layout">
      {/* 좌측 사이드바 */}


      {/* 우측 메인 콘텐츠 */}
      <div className={styles.archivePanel}>
        {/* 프로필 요약 */}
        <div className={styles.profileSummary}>
          <div className={styles.profile}>
            {userInfo?.profile ? (
              <img src={userInfo.profile} alt="프로필" />
            ) : (
              <div className={styles.profilePlaceholder}>
                {userInfo?.nickname ? userInfo.nickname.charAt(0).toUpperCase() : '😊'}
              </div>
            )}
          </div>
          <div className={styles.profileText}>
            <h3>{userInfo?.nickname || '사용자'}님!</h3>
            <p>Post 작성: {postList.length}개, 댓글 작성: {commentList.length}개</p>
          </div>
        </div>

        {/* 감정 통계 */}
        <div className={styles.emotionContainer}>
          <div className={styles.emotionBoxWrapper}>
            {/* 감정 통계 제목 */}
            <div className={styles.emotionHeader}>
              <h4>최근 감정 통계</h4>
              {/* <span>기간 7일</span> */}
            </div>
            <div className={styles.emotionBox}>
              <p>
                {Object.entries(emotionStats.emotionCount).length > 0 ? (
                  Object.entries(emotionStats.emotionCount)
                    .sort((a, b) => b[1] - a[1]) // 많이 사용한 순서로 정렬
                    .slice(0, 5) // 상위 5개만 표시
                    .map(([emoji, count], index) => (
                      <span key={emoji}>
                        {emoji}: {count}회
                        {index < Math.min(4, Object.entries(emotionStats.emotionCount).length - 1) ? '  ' : ''}
                      </span>
                    ))
                ) : (
                  '아직 기록된 감정이 없습니다.'
                )}
              </p>
              <p>
                ✨ 가장 자주 느낀 감정: {emotionStats.topEmotions.length > 0 ? emotionStats.topEmotions.join(', ') : '없음'}
                {emotionStats.mostFrequentCount > 0 && ` (${emotionStats.mostFrequentCount}회)`}
                <br />
                <p></p>
                📅 총 기록한 날: {emotionStats.totalDays}일 / {emotionStats.daysInCurrentMonth}일
              </p>
            </div>
          </div>
          <div className={styles.emotionBoxWrapper}>
            {/* My Archive Summary 제목 */}
            <div className={styles.emotionHeader}>
              <h4>My Archive Summary</h4>
              <span
                onClick={() => navigate('/my-activities')}
                style={{ cursor: 'pointer', color: '#ffffffff', fontSize: '14px' }}
                title="내 활동 상세보기"
              >
                상세보기 →
              </span>
            </div>
            <div className={styles.emotionBox}>
              <p>📌 Post 작성: {postList.length}개</p>
              <p>💬 남긴 댓글: {commentList.length}개</p>
              <p>📂 기록한 감정: {Object.keys(emotionStats.emotionCount).length}종류</p>
            </div>
          </div>
        </div>

        {/* 달력 + 감정 타임라인 */}
        <div className={styles.calendarRow}>
          <div className={styles.emotionBoxWrapper}>
            {/* 캘린더 제목 */}
            <div className={styles.emotionHeader}>
              <h4>Calendar</h4>
              <span></span>
            </div>
            <div className={styles.calendarBox}>
              <CalendarBox
                onDateClick={(date) => {
                  const dateKey = date.toISOString().split('T')[0];
                  const existingDiary = diaryList.find(diary =>
                    diary.createdAt && diary.createdAt.split('T')[0] === dateKey
                  );

                  if (existingDiary) {
                    // 일기가 있으면 선택해서 표시
                    setSelectedDiary(existingDiary);
                  } else {
                    // 일기가 없으면 일기 작성 페이지로 이동
                    navigate('/diary', {
                      state: {
                        selectedDate: date,
                        fromArchive: true
                      }
                    });
                  }
                }}
                dateEmojis={dateEmojis}
              />
            </div>
          </div>
          <div className={styles.emotionBoxWrapper}>
            {/* 다이어리 제목 */}
            <div className={styles.emotionHeader}>
              <h4>Diary</h4>
              <span>{selectedDiary ? selectedDiary.createdAt?.split('T')[0] : '날짜를 선택하세요'}</span>
            </div>
            <div className={styles.timelineBox}>
              {selectedDiary ? (
                <div className={diaryStyles.diaryCard}>
                  <div className={diaryStyles.diaryTitle}>
                    {selectedDiary.emoji} {selectedDiary.createdAt?.split('T')[0]}
                  </div>
                  <div className={styles.diaryActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditDiary(selectedDiary)}
                    >
                      ✏️수정하기
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteDiary(selectedDiary.diaryId)}
                    >
                      🗑️삭제하기
                    </button>
                  </div>
                  <hr className={diaryStyles.titleDivider} />
                  {selectedDiary.imgUrl && (
                    <>
                      <div className={`${diaryStyles.imageContainer} ${styles.imageContainer}`}>
                        {imageLoading && (
                          <div className={styles.imageLoading}>
                            이미지 로딩 중...
                          </div>
                        )}
                        {imageError && (
                          <div className={styles.imageError}>
                            이미지를 불러올 수 없습니다.
                          </div>
                        )}
                        <img
                          className={`${styles.diaryImage} ${imageLoading ? styles.loading : ''} ${imageError ? styles.error : ''}`}
                          src={(() => {
                            const imageUrl = selectedDiary.imgUrl.startsWith('http')
                              ? selectedDiary.imgUrl
                              : `http://bjava.iptime.org:8340${selectedDiary.imgUrl}`;
                            return imageUrl;
                          })()}
                          alt="일기 이미지"
                          onLoadStart={handleImageLoadStart}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      </div>
                      <hr className={diaryStyles.titleDivider} />
                    </>
                  )}
                  <div className={diaryStyles.diaryContent}>
                    {selectedDiary.content}
                  </div>
                </div>
              ) : (
                <p>캘린더에서 날짜를 선택하면 해당 날짜의 일기를 볼 수 있습니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* 감정 흐름 */}
        {/* <div className={styles.emotionBoxWrapper}>
          <div className={styles.emotionHeader}>
            <h4>감정 흐름 타임라인</h4>
            <span></span>
          </div>
          <div className={styles.timelineBox}>
            <p>(추후 그래프 예정)</p>
          </div>
        </div> */}

      </div>

      {/* 모달 */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default ArchivePage;