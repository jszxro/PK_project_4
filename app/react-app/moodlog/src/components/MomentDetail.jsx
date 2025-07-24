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
    const [commentContent, setCommentContent] = useState('');


    const [post, setPost] = useState(postFromState || null);

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

    // 댓글작성버튼
    const handleCommentSubmit = () => {
        if (!commentContent.trim()) {
            alert('댓글 내용을 입력하세요.');
            return;
        }

        axios.post('/api/comments',
            {
                postId: postId,
                content: commentContent
            },
            {
                headers: {
                    Authorization: `Bearer ${document.cookie.replace("signin_info=", "")}`
                },
                withCredentials: true
            }
        )
            .then(() => {
                alert('댓글이 등록되었습니다!');
                setCommentContent('');
                // 여기에 댓글 목록 새로고침 함수 호출해도 됨
            })
            .catch(err => {
                console.log("postId", postId)
                console.error('댓글 작성 실패:', err);
                alert('댓글 등록에 실패했습니다.');
            });
    };

    if (!post) return <div>불러오는 중...</div>;

    console.log('현재 로그인 유저:', userInfo?.userKey);
    console.log('게시글 작성자:', post);
    console.log('isAuthor:', isAuthor);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{post.title}</h2>
            <img src={post.imgUrl || post.thumbnail} alt="썸네일" style={{ maxWidth: '400px' }} />
            <p>{post.content}</p>
            <p>작성자: {post.author}</p>
            <p>감정: #{post.emojiId || post.tag}</p>
            <a href={post.url} target="_blank" rel="noopener noreferrer">🔗 유튜브 링크</a>
            {isAuthor && !showEditForm && (
                <button onClick={() => setShowEditForm(true)}>✏️ 수정하기</button>
            )}

            {showEditForm && (
                <EditMomentForm
                    post={post}
                    onSave={() => {
                        setShowEditForm(false);
                        window.location.reload();
                    }}
                    onCancel={() => setShowEditForm(false)}
                />
            )}

            <p>댓글<hr /></p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    style={{ flex: 1 }}
                />
                <button onClick={handleCommentSubmit}>댓글 달기</button>
            </div>
        </div>
    );
};

export default MomentDetail;
