package com.project.mood.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Getter
@Setter
@NoArgsConstructor
public class DiaryDTO {
    private String diaryId;
    private String userKey;
    private String content;
    private String emojiId;
    private String emoji; // 실제 이모지 문자 추가
    private String imgUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate selectedDate; // 선택된 날짜 추가
}
