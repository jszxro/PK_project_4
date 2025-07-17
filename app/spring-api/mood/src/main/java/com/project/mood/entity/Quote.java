package com.project.mood.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "QUOTES")
@Getter
@Setter
@NoArgsConstructor
public class Quote {

    @Id
    @Column(name = "QUOTE_ID")
    private String quoteId;

    @Column(name = "CONTENT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "EMOJI_ID") // NULL 허용
    private Emoji emoji; // emoji는 nullable이라 없어도 됨
}
