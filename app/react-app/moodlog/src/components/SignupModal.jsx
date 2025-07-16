import { useState } from 'react';
import styles from '../assets/css/LoginModal.module.css';
import axios from "axios";

function SignupModal({ onClose }) {

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
        }
      })
  }





  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>회원가입</h2>

        <input type="text" placeholder="아이디" className={styles.modalInput} name="userId" value={userinfo.userId} onChange={handleUserinfo} />
        <input type="password" placeholder="비밀번호" name='userPw' value={userinfo.userPw} className={styles.modalInput} onChange={handleUserinfo} />
        <input type="password" placeholder="비밀번호 확인" className={styles.modalInput} />
        <input type="text" placeholder="닉네임" name='nickname' value={userinfo.nickname} className={styles.modalInput} onChange={handleUserinfo} />
        <input type="email" placeholder="이메일" name='userEmail' value={userinfo.userEmail} className={styles.modalInput} onChange={handleUserinfo} />
        <button className={styles.modalLoginBtn} onClick={() => handleSignup()}>
          가입하기
        </button>
      </div>
    </div>
  );
}

export default SignupModal;


