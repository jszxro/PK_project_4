import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import EditMomentForm from './EditMomentForm'
import '../assets/css/MomentDetail.css';

const MomentDetail = () => {
    const [userReaction, setUserReaction] = useState(null); // 현재 사용자의 좋아요 여부
    const [likeCount, setLikeCount] = useState(0); // 전체 좋아요 수
    const { userInfo } = useContext(UserContext);
    const { postId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const postFromState = location.state?.post;
    const [showEditForm, setShowEditForm] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);


    const [post, setPost] = useState(postFromState || null);


    // 하트 수 가져오기
    useEffect(() => {
        if (!post || !userInfo) return;

        // 좋아요 상태 조회
        axios.get(`/api/reactions/check?postId=${post.id}&userKey=${userInfo.userKey}`)
            .then(res => setUserReaction(res.data.reactionType))
            .catch(err => console.error("좋아요 상태 조회 실패:", err));

        // 총 좋아요 수 조회
        axios.get(`/api/reactions/count?postId=${post.id}`)
            .then(res => setLikeCount(res.data.count))
            .catch(err => console.error("좋아요 수 조회 실패:", err));
    }, [post, userInfo]);

    // 하트클릭
    const toggleReaction = () => {
        axios.post(`/api/reactions/toggle`, {
            postId: post.id,
            userKey: userInfo.userKey
        })
            .then(res => {
                const newReactionType = res.data.reactionType;
                setUserReaction(newReactionType);

                // 좋아요 수 증감 처리
                if (newReactionType === 1) {
                    setLikeCount(prev => prev + 1);
                } else {
                    setLikeCount(prev => prev - 1);
                }
            })
            .catch(err => {
                console.error("좋아요 토글 실패:", err);
            });
    };
    if (!post) return null;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommentSubmit();
        }
    };
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

    useEffect(() => {
        axios.get(`/api/comments/${postId}`)
            .then(res => setComments(res.data))
            .catch(err => console.error('댓글 불러오기 실패:', err));
    }, [postId, commentContent]);


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
            <div className='momentLikes' onClick={toggleReaction} style={{ cursor: 'pointer' }}>
                {userReaction === 1 ? "💛" : "🤍"} {likeCount}
            </div>
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

            <p>댓글<hr /></p>
            <div className='comment-top'>
                <input
                    type="text"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    style={{ flex: 1 }}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleCommentSubmit}>댓글 달기</button>
            </div>
            {/* 댓글 조회부분 */}
            <div style={{ marginTop: '1rem' }}>
                {comments.map((comment, index) => (
                    <div key={index} className='comment-search'>
                        {comment.profile ? (
                            <img
                                src={comment.profile}
                                alt="프로필"
                                className='comment-img'
                            />
                        ) : (
                            <div className='comment-default'
                            >{comment.nickname[0] || 'U'}</div>
                        )}

                        {/* 댓글 본문 */}
                        <div>
                            <div><strong>{comment.nickname}</strong></div>
                            <div>{comment.content}</div>
                            <div style={{ fontSize: '0.8rem', color: 'gray' }}>
                                {new Date(comment.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MomentDetail;
