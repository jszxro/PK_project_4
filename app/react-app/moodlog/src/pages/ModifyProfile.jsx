import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/css/ModifyProfile.module.css';

const CLOUDINARY_UPLOAD_PRESET = 'mood_profile';
const CLOUDINARY_CLOUD_NAME = 'dxfehoslo';

const ProfileEditPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '',
        // userPw: '',
        nickname: '',
        userEmail: '',
        profile: '',
    });
    const [userPw, setUserPw] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataImg = new FormData();
        formDataImg.append("file", file);
        formDataImg.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formDataImg
            );
            const imageUrl = response.data.secure_url;
            setFormData(prev => ({
                ...prev,
                profile: imageUrl
            }));
        } catch (err) {
            alert("이미지 업로드 실패");
        }
    };

    useEffect(() => {
        axios.get('/api/user-info', { withCredentials: true })
            .then(res => {
                const { userId, nickname, userEmail, profile } = res.data;
                setFormData({ userId, nickname, userEmail, profile: profile || '' });
                setUserPw('');
            })
            .catch(() => {
                alert("로그인이 필요합니다");
            });
    }, []);

    const handleSubmit = () => {
        const { userId, nickname, userEmail } = formData;
        // if (!userId || !userPw || !nickname || !userEmail) {
        if (!userId || !nickname || !userEmail) {
            alert("프로필 이미지와 비밀번호는 선택사항");
            return;
        }

        const updatedData = {
            ...formData
        };

        // 비밀번호를 입력한 경우에만 추가
        if (userPw.trim() !== '') {
            updatedData.userPw = userPw;
        }

        axios.put('/api/members/update-profile', updatedData, { withCredentials: true })
            .then(() => {
                alert("수정 완료");
                navigate('/');
            })
            .catch(() => alert("수정 실패"));
    };

    return (
        <div className={styles.profileWrapper}>
            <h2 className={styles.title}>프로필 수정</h2>

            <div className={styles.profileImageContainer}>
                {formData.profile ? (
                    <img src={formData.profile} alt="프로필" className={styles.profileImage} />
                ) : (
                    <div className={styles.defaultProfile}>{formData.nickname[0] || 'U'}</div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className={styles.inputFile} />
                <button className={styles.defaultBtn} onClick={() => setFormData(prev => ({ ...prev, profile: '' }))}>기본프로필로 변경</button>
            </div>

            <div className={styles.formGroup}>
                <label>아이디</label>
                <input name="userId" value={formData.userId} disabled className={styles.input} />
            </div>
            <div className={styles.formGroup}>
                <label>비밀번호 변경</label>
                <input name="userPw" value={userPw} onChange={(e) => setUserPw(e.target.value)} placeholder="새 비밀번호" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
                <label>닉네임 변경</label>
                <input name="nickname" value={formData.nickname} onChange={handleChange} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
                <label>이메일 변경</label>
                <input name="userEmail" value={formData.userEmail} onChange={handleChange} className={styles.input} />
            </div>

            <button className={styles.submitBtn} onClick={handleSubmit}>수정하기</button>
        </div>
    );
};

export default ProfileEditPage;
