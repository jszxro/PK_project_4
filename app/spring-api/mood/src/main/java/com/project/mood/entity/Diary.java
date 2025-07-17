package com.project.mood.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "DIARY")
@Getter
@Setter
@NoArgsConstructor
public class Diary {

    @Id
    @Column(name = "DIARY_ID")
    private String diaryId;

    @Column(name = "USER_KEY", nullable = false)
    private String userKey;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "EMOJI_ID", nullable = false)
    private Emoji emoji;

    @Column(name = "IMG_URL") // DB에 이 컬럼도 있으므로 매핑 필요
    private String imgUrl;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}