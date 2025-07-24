import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import styles from '../assets/css/DiaryPage.module.css';

function DiaryDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useContext(UserContext);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [content, setContent] = useState('');
  const [emojiList, setEmojiList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ 툴팁 관련 상태
  const [hoveredEmojiDesc, setHoveredEmojiDesc] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (location.state?.selectedDate) {
      setSelectedDate(new Date(location.state.selectedDate));
    } else {
      setSelectedDate(new Date());
    }
  }, [location.state]);

  useEffect(() => {
    const loadEmojis = async () => {
      try {
        const response = await axios.get('/api/emojis');
        setEmojiList(response.data);
      } catch (error) {
        console.error('이모지 목록 불러오기 실패:', error);
      }
    };
    loadEmojis();
  }, []);

  useEffect(() => {
    if (location.state?.selectedTag && emojiList.length > 0) {
      const matchedEmoji = emojiList.find(e => e.tag === location.state.selectedTag);
      if (matchedEmoji) {
        setSelectedEmoji(matchedEmoji.emoji);
      }
    }
  }, [location.state, emojiList]);

  // 일기 저장
  const handleSave = async () => {
    if (!selectedEmoji || !content.trim()) {
      alert('감정과 내용을 모두 입력해주세요.');
      return;
    }

    if (!userInfo) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);

    try {
      const dateKey = selectedDate.toISOString().split('T')[0];
      const userKey = userInfo.userKey || localStorage.getItem('userKey');
      const existingResponse = await axios.get(`/api/diaries/user/${userKey}`);
      const existingDiary = existingResponse.data.find(diary =>
        diary.createdAt && diary.createdAt.split('T')[0] === dateKey
      );

      if (existingDiary) {
        alert('해당 날짜에 이미 일기가 작성되어 있습니다.');
        setIsLoading(false);
        return;
      }

      let imgUrl = null;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
          const uploadResponse = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          imgUrl = uploadResponse.data.url;
        } catch (uploadError) {
          console.error('이미지 업로드 실패:', uploadError);
          alert('이미지 업로드에 실패했습니다. 이미지 없이 저장하시겠습니까?');
          if (!confirm('이미지 없이 저장하시겠습니까?')) {
            setIsLoading(false);
            return;
          }
        }
      }

      const diaryData = {
        userKey,
        emoji: selectedEmoji,
        content,
        selectedDate: dateKey,
        imgUrl,
      };

      await axios.post('/api/diaries', diaryData);

      alert('일기가 성공적으로 저장되었습니다!');
      if (location.state?.fromArchive) {
        navigate('/archive', { state: { refreshData: true } });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('일기 저장 실패:', error);
      alert('일기 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCancel = () => {
    if (location.state?.fromArchive) {
      navigate('/archive');
    } else {
      navigate('/');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className={styles.diaryContainer}>
      <div className={styles.diaryHeader}>
        <h2>Diary</h2>
        <div className={styles.dateDisplay}>{formatDate(selectedDate)}</div>
      </div>

      <div className={styles.diaryForm}>
        {/* 감정 선택 */}
        <div className={styles.emojiSection}>
          <h3>오늘의 감정을 선택해주세요</h3>
          <div className={styles.emojiGrid}>
            {emojiList.map((emoji) => (
              <button
                key={emoji.emojiId}
                className={`${styles.emojiButton} ${selectedEmoji === emoji.emoji ? styles.selected : ''}`}
                onClick={() => setSelectedEmoji(emoji.emoji)}
                onMouseEnter={(e) => {
                  setHoveredEmojiDesc(emoji.description || emoji.tag || '감정');
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredEmojiDesc('')}
              >
                {emoji.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className={styles.imageSection}>
          <h3>사진 추가 (선택사항)</h3>
          <div className={styles.imageUpload}>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="imageInput" className={styles.imageUploadButton}>
              📷 사진 선택
            </label>

            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="미리보기" className={styles.previewImage} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={styles.removeImageButton}
                >
                  ✕ 제거
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 내용 작성 */}
        <div className={styles.contentSection}>
          <h3>오늘 하루는 어땠나요?</h3>
          <textarea
            className={styles.contentTextarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 있었던 일을 작성하세요"
            rows={10}
          />
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonSection}>
          <button
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={isLoading}
          >
            취소
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>

      {/* 툴팁 출력 */}
      {hoveredEmojiDesc && (
        <div
          className={styles.tooltip}
          style={{ top: tooltipPos.y + 15, left: tooltipPos.x + 15 }}
        >
          {hoveredEmojiDesc}
        </div>
      )}
    </div>
  );
}

export default DiaryDetail;
