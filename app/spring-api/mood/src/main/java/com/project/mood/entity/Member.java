package com.project.mood.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MEMBER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "USER_KEY", length = 32)
    private String userKey;

    @Column(name = "USER_ID", nullable = false, unique = true)
    private String userId;

    @Column(name = "USER_PW", nullable = false)
    private String userPw;

    @Column(name = "NICKNAME", nullable = false)
    private String nickname;

    @Column(name = "USER_EMAIL", nullable = false)
    private String userEmail;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "STATUS")
    private Integer status;

    @Column(name = "ROLE")
    private String role;

    @Column(name = "PROFILE")
    private String profile;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // 현재시간으로 설정
        this.status = 0; // 기본값 설정
        this.role = "USER"; // 기본값 설정
    }
}
