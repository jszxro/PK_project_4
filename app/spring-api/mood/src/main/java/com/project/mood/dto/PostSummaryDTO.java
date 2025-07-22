package com.project.mood.dto;

public interface PostSummaryDTO {
    String getPostId();

    String getAuthor(); // nickname

    String getTitle();

    String getContent();

    String getUrl();

    String getImgUrl();

    String getEmojiId();

    String getCreatedAt();

    Integer getLikes();
}
