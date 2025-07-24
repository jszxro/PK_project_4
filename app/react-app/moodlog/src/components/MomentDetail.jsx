import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import EditMomentForm from './EditMomentForm'

const MomentDetail = () => {
    const { userInfo } = useContext(UserContext);
    const { postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const postFromState = location.state?.post;
    const [showEditForm, setShowEditForm] = useState(false);


    const [post, setPost] = useState(postFromState || null);

    const handleDelete = async () => {
        const confirmed = window.confirm('정말 이 게시글을 삭제하시겠습니까?');
        if (!confirmed) return;

        try {
            await axios.delete(`/api/posts/${postId}`, {
                data: { userKey: userInfo.userKey },  // axios delete에서 body 보내는 법
                withCredentials: true
            });
            alert('게시글이 삭제되었습니다.');
            navigate('/moments');
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    useEffect(() => {
        // state에 데이터가 있으면 API 요청 안 함
        if (!postFromState) {
            axios.get(`/api/posts/${postId}`)
                .then(res => setPost(res.data))
                .catch(err => {
                    console.error('상세 게시글 로딩 실패:', err);
                    alert('게시글을 불러오지 못했습니다.');
                    navigate('/moments');
                });
        }
    }, [postId]);

    const isAuthor = userInfo?.userKey === post.userKey;


    if (!post) return <div>불러오는 중...</div>;

    console.log('현재 로그인 유저:', userInfo?.userKey);
    console.log('게시글 작성자:', post);
    console.log('isAuthor:', isAuthor);
    console.log('post:', post);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{post.content_title}</h2>
            <img src={post.imgUrl || post.thumbnail} alt="썸네일" style={{ maxWidth: '400px' }} />
            <p>{post.content}</p>
            <p>작성자: {post.author}</p>
            {post.time && <p>작성일: {new Date(post.time).toLocaleString()}</p>}
            <p>감정: #{post.emojiId || post.tag}</p>
            <a href={post.url} target="_blank" rel="noopener noreferrer">🔗 유튜브 링크</a>
            {isAuthor && !showEditForm && (
                <>
                    <button onClick={() => setShowEditForm(true)}>✏️ 수정하기</button>
                    <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>🗑️ 삭제하기</button>
                </>
            )}

            {showEditForm && (
                <EditMomentForm
                    post={post}
                    onSave={(updatedPost) => {
                        setPost(updatedPost);
                        setShowEditForm(false);
                        // window.location.reload();
                    }}
                    onCancel={() => setShoswEditForm(false)}
                />
            )}
        </div>
    );
};

export default MomentDetail;
