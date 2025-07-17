import { useState } from 'react';
import styles from '../assets/css/LoginModal.module.css';
import axios from "axios";
import SuccessPopup from './SuccessPopup';

function SignupModal({ onClose, onSwitchToLogin }) {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
  };

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

        {/* 중복 확인 체크박스 - 오른쪽 아래 정렬 */}
        <div className={styles.checkWrapper}>
          <label className={styles.checkLabel}>
            <input type="checkbox" />
            중복 확인
          </label>
        </div>

        {/* 나머지 입력 필드 */}
        <input type="password" placeholder="비밀번호" name='userPw' value={userinfo.userPw} className={styles.modalInput} onChange={handleUserinfo} />
        <input type="password" placeholder="비밀번호 확인" className={styles.modalInput} />
        <input type="text" placeholder="닉네임" name='nickname' value={userinfo.nickname} className={styles.modalInput} onChange={handleUserinfo} />
        <input type="email" placeholder="이메일" name='userEmail' value={userinfo.userEmail} className={styles.modalInput} onChange={handleUserinfo} />

        {/* 가입 버튼 */}
        <button className={styles.modalLoginBtn} onClick={() => handleSignup()}>
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
