import { useState, useCallback } from 'react';
import styles from '../assets/css/LoginModal.module.css';
import axios from "axios";
import SuccessPopup from './SuccessPopup';
import debounce from 'lodash/debounce';


function SignupModal({ onClose, onSwitchToLogin }) {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [userinfo, setUserinfo] = useState({
    userId: '',
    userPw: '',
    nickname: '',
    userEmail: ''
  });

  // 회원정보 변경 핸들러
  const handleUserinfo = (e) => {
    const { name, value } = e.target;
    setUserinfo(prev => ({
      ...prev,
      [name]: value
    }));
    // 아이디 입력 중일 때 중복 확인
    if (name === "userId") {
      checkUserId(value);
    }
  };

  const checkUserId = useCallback(debounce((userId) => {
    if (!userId) {
      setIdCheckMessage('');
      setIsIdAvailable(false);
      return;
    }

    axios.get(`/api/check-id?userId=${userId}`)
      .then(res => {
        if (res.data.exists) {
          setIdCheckMessage("❌ 이미 존재하는 아이디입니다.");
          setIsIdAvailable(false);
        } else {
          setIdCheckMessage("✅ 사용 가능한 아이디입니다!");
          setIsIdAvailable(true);
        }
      })
      .catch(() => {
        setIdCheckMessage("오류 발생");
      });
  }, 300), []);

  const handleSignup = () => {
    console.log(userinfo)
    axios.post('/api/signup', {
      userId: userinfo.userId,
      userPw: userinfo.userPw,
      nickname: userinfo.nickname,
      userEmail: userinfo.userEmail
    })
      .then(res => {
        if (res.status === 200) {
          alert("회원가입 완료");
          console.log(res.data);
          setShowSuccessPopup(true);
        }
      })
        .catch(err => {
        console.error("회원가입 오류:", err);
      });
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Moodlog</h2>

        {/* 아이디 입력 */}
        <input type="text" placeholder="아이디" className={styles.modalInput} name="userId" value={userinfo.userId} onChange={handleUserinfo} />

        {/* 중복 확인 */}
        <p style={{ fontSize: "0.8rem", color: idCheckMessage.includes("가능") ? "green" : "red" }}>
          {idCheckMessage}
        </p>
        {/* 나머지 입력 필드 */}
        <input type="password" placeholder="비밀번호" name='userPw' value={userinfo.userPw} className={styles.modalInput} onChange={handleUserinfo} disabled={!isIdAvailable} />
        <input type="password" placeholder="비밀번호 확인" className={styles.modalInput} disabled={!isIdAvailable} />
        <input type="text" placeholder="닉네임" name='nickname' value={userinfo.nickname} className={styles.modalInput} onChange={handleUserinfo} disabled={!isIdAvailable} />
        <input type="email" placeholder="이메일" name='userEmail' value={userinfo.userEmail} className={styles.modalInput} onChange={handleUserinfo} disabled={!isIdAvailable} />

        {/* 가입 버튼 */}
        <button className={styles.modalLoginBtn} onClick={() => handleSignup()} disabled={!isIdAvailable}>
          회원가입
        </button>

        {/* 하단 안내 텍스트 */}
        <p
        className={styles.bottomText}
        onClick={() => {
          onClose();           // 현재 회원가입 모달 닫기
          onSwitchToLogin();   // 로그인 모달 다시 열기
        }}
        style={{ cursor: 'pointer' }}
      >
        이미 계정이 있으신가요?
      </p>
      </div>
    </div>
  );
}

export default SignupModal;
