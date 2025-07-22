package com.project.mood.service;

import com.project.mood.dto.DiaryDTO;
import com.project.mood.entity.Diary;
import com.project.mood.entity.Emoji;
import com.project.mood.repository.DiaryRepository;
import com.project.mood.repository.EmojiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DiaryService {

  @Autowired
  private DiaryRepository diaryRepository;

  @Autowired
  private EmojiRepository emojiRepository;

  public String createDiary(DiaryDTO request) {
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

  public List<DiaryDTO> getDiariesByUserKey(String userKey) {
    List<Diary> diaries = diaryRepository.findByUserKey(userKey);

    return diaries.stream().map(d -> {
      DiaryDTO dto = new DiaryDTO();
      dto.setDiaryId(d.getDiaryId());
      dto.setUserKey(d.getUserKey());
      dto.setContent(d.getContent());
      dto.setEmojiId(d.getEmoji().getEmojiId());
      dto.setImgUrl(d.getImgUrl());
      dto.setCreatedAt(d.getCreatedAt());
      dto.setUpdatedAt(d.getUpdatedAt());
      return dto;
    }).collect(Collectors.toList());
  }
}
