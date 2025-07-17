package com.project.mood.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "EMOJI")
@Getter
@Setter
@NoArgsConstructor
public class Emoji {

    @Id
    @Column(name = "EMOJI_ID")
    private String emojiId;

    @Column(name = "TAG")
    private String tag;

    @Column(name = "EMOJI")
    private String emoji;
}