package com.project.mood.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String sender; // 닉네임
    private String profile; // 프로필 이미지
    private String message;
    private String emojiId;
}