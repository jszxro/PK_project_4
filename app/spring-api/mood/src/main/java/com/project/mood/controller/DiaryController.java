package com.project.mood.controller;

import com.project.mood.dto.DiaryDTO;
import com.project.mood.entity.Diary;
import com.project.mood.entity.Emoji;
import com.project.mood.repository.DiaryRepository;
import com.project.mood.repository.EmojiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/diaries")
public class DiaryController {

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private EmojiRepository emojiRepository;

    @PostMapping
    public String createDiary(@RequestBody DiaryDTO request) {
        Emoji emoji = emojiRepository.findById(request.getEmojiId())
                .orElseThrow(() -> new RuntimeException("이모지 못 찾았어요"));

        Diary diary = new Diary();
        diary.setDiaryId(UUID.randomUUID().toString());
        diary.setUserKey(request.getUserKey());
        diary.setContent(request.getContent());
        diary.setEmoji(emoji);
        diary.setImgUrl(request.getImgUrl());

        diaryRepository.save(diary);

        return "저장 완료!";
    }
}
