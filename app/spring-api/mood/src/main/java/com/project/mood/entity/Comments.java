package com.project.mood.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "COMMENTS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comments {

    @Id
    @Column(name = "COMMENT_ID")
    private String commentId;

    @Column(name = "POST_ID")
    private String postId;

    @Column(name = "USER_KEY")
    private String userKey;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "PARENT_ID")
    private String parentId;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
