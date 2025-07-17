package com.project.mood.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class DiaryDTO {
    private String userKey;
    private String content;
    private String emojiId;
    private String imgUrl;
}
