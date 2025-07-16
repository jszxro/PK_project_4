import React from 'react';
import styles from '../assets/css/LoginModal.module.css';

function SignupModal({ onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Moodlog</h2>

        {/* 아이디 입력 */}
        <input type="text" placeholder="아이디" className={styles.modalInput} />

        {/* 중복 확인 체크박스 - 오른쪽 아래 정렬 */}
        <div className={styles.checkWrapper}>
          <label className={styles.checkLabel}>
            <input type="checkbox" />
            중복 확인
          </label>
        </div>

        {/* 나머지 입력 필드 */}
        <input type="text" placeholder="닉네임" className={styles.modalInput} />
        <input type="password" placeholder="비밀번호" className={styles.modalInput} />
        <input type="password" placeholder="비밀번호 확인" className={styles.modalInput} />
        <input type="email" placeholder="이메일" className={styles.modalInput} />

        {/* 가입 버튼 */}
        <button className={styles.modalLoginBtn} onClick={onClose}>
          회원가입
        </button>

        {/* 하단 안내 텍스트 */}
        <p className={styles.bottomText}>이미 계정이 있으신가요?</p>
      </div>
    </div>
  );
}

export default SignupModal;
