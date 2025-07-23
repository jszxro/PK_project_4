// src/pages/ProfileEditPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CLOUDINARY_UPLOAD_PRESET = 'mood_profile'; // Cloudinary에서 설정한 업로드 preset
const CLOUDINARY_CLOUD_NAME = 'dxfehoslo'; // Cloudinary 클라우드 이름

const ProfileEditPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '',
        userPw: '',
        nickname: '',
        userEmail: '',
        profile: '',
    });
    const [userPw, setUserPw] = useState('');

    // input 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 이미지 파일 변경 시
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
            console.error(err);
        }
    };

    // 사용자 정보 가져오기
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

    // 수정하기버튼
    const handleSubmit = () => {
        const { userId, nickname, userEmail } = formData;

        if (!userId || !userPw || !nickname || !userEmail) {
            alert("모든 항목을 입력해주세요 (프로필 이미지는 제외)");
            return;
        }

        const updatedData = {
            ...formData,
            userPw: userPw  // 입력한 새 비번
        };

        axios.put('/api/members/update-profile', updatedData, { withCredentials: true })
            .then(() => alert("수정 완료"),
                navigate('/')
            )
            .catch(() => alert("수정 실패"));
    };

    return (
        <>
            <h2>프로필 수정</h2>

            <div>
                {formData.profile ? <img src={formData.profile} alt="프로필" className="profile-circle" /> : <div className="profile-circle" >{formData.nickname[0] || 'U'}</div>}
            </div>

            <div>
                <label>프로필 이미지 업로드: </label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button onClick={() => {
                    setFormData(prev => ({
                        ...prev,
                        profile: ''
                    }));
                }}>
                    기본프로필로 변경
                </button>
            </div>

            <div>
                아이디: <input name="userId" value={formData.userId} disabled />
            </div>
            <div>
                비밀번호 변경: <input name="userPw" value={userPw} onChange={(e) => setUserPw(e.target.value)} placeholder="새 비밀번호" />
            </div>
            <div>
                닉네임 변경: <input name="nickname" value={formData.nickname} onChange={handleChange} />
            </div>
            <div>
                이메일 변경: <input name="userEmail" value={formData.userEmail} onChange={handleChange} />
            </div>

            <button onClick={handleSubmit}>수정하기</button>
        </>
    );
};

export default ProfileEditPage;
