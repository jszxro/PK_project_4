import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import EditMomentForm from './EditMomentForm'
import styles from '../assets/css/MomentDetail.module.css';

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
                .then(res => {
                    setPost(res.data);
                    console.log("게시글정보", res.data);

                })
                .catch(err => {
                    console.error('상세 게시글 로딩 실패:', err);
                    alert('게시글을 불러오지 못했습니다.');
                    navigate('/moments');
                });
        }
    }, []);

    useEffect(() => {
        axios.get(`/api/comments/${postId}`)
            .then(res => {
                setComments(res.data);
                console.log("📌 댓글 목록:", res.data);
            })
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

    // 댓글 삭제버튼
    const handleDeleteComment = (commentId) => {
        const confirmed = window.confirm("댓글을 삭제하시겠습니까?");
        if (!confirmed) return;

        axios.delete(`/api/comments/${commentId}`, {
            data: { userKey: userInfo.userKey }, // 백엔드에서 유저 확인
            withCredentials: true
        })
            .then(() => {
                setComments(prev => prev.filter(c => c.commentId !== commentId)); // 삭제 후 UI 업데이트
                alert("댓글이 삭제되었습니다.");
            })
            .catch(err => {
                console.error("댓글 삭제 실패:", err);
                alert("댓글 삭제에 실패했습니다.");
            });
    };

    if (!post) return <div>불러오는 중...</div>;


    return (
        <div className={styles.container}>
            <div className={styles.postCard}>
                <div className={styles.postHeaderRow}>
                    <h2 className={styles.title}>{post.content_title}</h2>
                </div>

                {/* ⬇ 여기: 작성자 + 작성일 추가 */}
                <div className={styles.metaTop}>
                    <div className={styles.metaLeft}>작성자: {post.author}</div>
                    <div className={styles.metaCenter}>감정: #{post.emojiId || post.tag}</div>
                    {post.time && (
                        <div className={styles.metaRight}>
                            작성일: {new Date(post.time).toLocaleString()}
                        </div>
                    )}
                </div>

                <div className={styles.mediaAndContent}>
                    <div className={styles.thumbnailBlock}>
                        <img
                            src={post.imgUrl || post.thumbnail}
                            alt="썸네일"
                            className={styles.thumbnail}
                        />
                        <div className={styles.linkBelowThumbnail}>
                            <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                🔗 유튜브 링크
                            </a>
                        </div>
                        <div className={styles.momentLikes} onClick={toggleReaction} style={{ cursor: 'pointer' }}>
                            {userReaction === 1 ? "💛" : "🤍"} {likeCount}
                        </div>
                    </div>

                    {/* 본문 내용 */}
                    <p className={styles.content}>{post.content}</p>
                    {isAuthor && !showEditForm && (
                        <div className={styles.buttonGroup}>
                            <button className={styles.editButton} onClick={() => setShowEditForm(true)}>✏️ 수정</button>
                            <button className={styles.deleteButton} onClick={handleDelete}>🗑️ 삭제</button>
                        </div>
                    )}
                </div>

                {showEditForm && (
                    <EditMomentForm
                        post={post}
                        onSave={(updatedPost) => {
                            setPost(updatedPost);
                            setShowEditForm(false);
                        }}
                        onCancel={() => setShowEditForm(false)}
                    />
                )}
            </div>

            {/* 댓글 영역은 그대로 유지 */}
            <div className={styles.commentSection}>
                <p className={styles.commentHeader}> 💬댓글 <hr /></p>
                <div className={styles.commentBox}>
                    <input
                        type="text"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        onKeyDown={handleKeyDown}
                        className={styles.commentInput}
                    />
                    <button onClick={handleCommentSubmit} className={styles.commentButton}>댓글 달기</button>
                </div>
                <div className={styles.commentList}>
                    {comments.map((comment, index) => (
                        <div key={index} className={styles.commentItem}>
                            <div className={styles.commentNickname}>{comment.profile ? (
                                <img
                                    src={comment.profile}
                                    alt="프로필"
                                    className={styles.commentProfile}
                                />
                            ) : (
                                <div className={styles.commentDefault}
                                >{comment.nickname[0] || 'U'}</div>
                            )}
                                <strong>
                                    {comment.nickname}
                                    {comment.nickname === post.author && ' (작성자)'}
                                </strong></div>
                            <div className={styles.commentContent}>{comment.content}</div>
                            <div className={styles.commentTime}>{new Date(comment.createdAt).toLocaleString()}{comment.nickname === userInfo.nickname && (
                                <button
                                    className={styles.commentDeleteButton}
                                    onClick={() => handleDeleteComment(comment.commentId)}
                                >
                                    삭제
                                </button>
                            )}</div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );


};

export default MomentDetail;
