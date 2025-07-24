package com.project.mood.dto;

import lombok.Data;

@Data
public class CommentDTO {
    private String postId;
    private String content;
    private String parentId; // 대댓글인 경우만
}