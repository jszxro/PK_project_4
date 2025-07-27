import { useEffect, useRef, useState, useContext } from "react";
import { UserContext } from '../context/UserContext';
import styles from "../assets/css/ChatPage.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChatPage() {
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [emojiId, setEmojiId] = useState(null);
    const ws = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    useEffect(() => {
        axios.get(`/api/diaries/today-with-emoji`, {
            params: { userKey: userInfo.userKey }
        })
            .then(res => {
                if (res.data.length === 0) {
                    alert("오늘 일기를 먼저 작성해주세요!");
                    navigate("/diary");
                } else {
                    const emoji = res.data[0].emoji.emojiId;
                    setEmojiId(emoji);

                    // ✅ 로컬 저장된 메시지 불러오기
                    const saved = localStorage.getItem(`chat-${emoji}`);
                    if (saved) setMessages(JSON.parse(saved));

                    // ✅ WebSocket 연결은 한 번만
                    if (!ws.current) {
                        ws.current = new WebSocket(`ws://localhost:8080/ws/chat/${emoji}`);
                        ws.current.onmessage = (event) => {
                            const msg = JSON.parse(event.data);
                            console.log("📩 메시지 수신:", msg); // 로그로 확인
                            setMessages(prev => {
                                const updated = [...prev, msg];
                                localStorage.setItem(`chat-${emoji}`, JSON.stringify(updated));
                                return updated;
                            });
                        };
                    }
                }
            })
            .catch(err => console.error("오늘 일기 조회 실패", err));
    }, []);

    const sendMessage = () => {
        if (ws.current && message.trim() !== "") {
            const msgObj = {
                sender: userInfo.nickname,
                profile: userInfo.profile,
                message: message,
                emojiId: emojiId
            };
            ws.current.send(JSON.stringify(msgObj));
            setMessage("");
        }
    };

    return (
        <div className={styles.chatBody}>
            <h2 className={styles.chatTitle}>#{emojiId} 사람들의 모임</h2>

            <div className={styles.messageList}>
                {messages.map((msg, i) => {
                    const isMine = msg.sender === userInfo.nickname;
                    return (
                        <div
                            key={i}
                            className={`${styles.message} ${isMine ? styles.myMessage : styles.otherMessage}`}
                        >
                            {!isMine && <img src={msg.profile} alt="프로필" className={styles.chatProfile} />}
                            <div className={styles.textBlock}>
                                <strong>{msg.sender}</strong>: {msg.message}
                            </div>
                            {isMine && <img src={msg.profile} alt="프로필" className={styles.chatProfile} />}
                        </div>
                    );
                })}
                <div ref={scrollRef} /> {/* 메시지 마지막 위치 스크롤용 */}
            </div>

            <div className={styles.inputBar}>
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
}

export default ChatPage;
