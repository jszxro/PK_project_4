package com.project.mood.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDTO {
    private String postId;
    private String userKey;
    private String title;
    private String content;
    private String url;
    private String imgUrl;
    private String emojiId;
}