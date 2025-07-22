package com.project.mood.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "REACTION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reaction {

    // @GeneratedValue(strategy = GenerationType.SEQUENCE, generator =
    // "REACTION_SEQ")
    @Id
    @SequenceGenerator(name = "REACTION_SEQ", sequenceName = "REACTION_SEQ", allocationSize = 1)
    @Column(name = "REACTION_ID")
    private String reactionId;

    @Column(name = "POST_ID", nullable = false)
    private String postId;

    @Column(name = "USER_KEY", nullable = false)
    private String userKey;

    @Column(name = "REACTION_TYPE", nullable = false)
    private int reactionType;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
