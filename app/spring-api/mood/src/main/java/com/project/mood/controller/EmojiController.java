package com.project.mood.controller;

import com.project.mood.entity.Emoji;
import com.project.mood.repository.EmojiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emojis")
public class EmojiController {

    @Autowired
    private EmojiRepository emojiRepository;

    @GetMapping
    public List<Emoji> getAllEmojis() {
        return emojiRepository.findAll();
    }
}
