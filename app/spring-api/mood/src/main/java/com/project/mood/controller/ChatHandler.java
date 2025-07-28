package com.project.mood.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Component;

import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.CloseStatus;

@Component
public class ChatHandler extends TextWebSocketHandler {

    private final Map<String, List<WebSocketSession>> chatRooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String emojiId = getEmojiIdFromPath(session);
        chatRooms.computeIfAbsent(emojiId, k -> new CopyOnWriteArrayList<>()).add(session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String emojiId = getEmojiIdFromPath(session);
        for (WebSocketSession s : chatRooms.getOrDefault(emojiId, List.of())) {
            if (s.isOpen())
                s.sendMessage(message); // 모두에게 브로드캐스트
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        chatRooms.values().forEach(sessions -> sessions.remove(session));
    }

    private String getEmojiIdFromPath(WebSocketSession session) {
        String uri = session.getUri().toString();
        return uri.substring(uri.lastIndexOf("/") + 1);
    }
}
