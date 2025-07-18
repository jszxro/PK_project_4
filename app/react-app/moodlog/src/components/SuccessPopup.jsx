import React from 'react';
import styles from '../assets/css/LoginModal.module.css'; // 같은 스타일 파일 사용

function SuccessPopup({ message, onClose }) {
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button onClick={onClose} className={styles.popupBtn}>확인</button>
      </div>
      {showSuccessPopup && (
        <SuccessPopup
          message={`🎉 ${userinfo.nickname} 님, 가입을 축하드립니다!`}
          onClose={() => {
            setShowSuccessPopup(false); // 팝업 닫기
            onClose(); // 모달 닫기
          }}
        />
      )}
    </div>
  );
}

export default SuccessPopup;
