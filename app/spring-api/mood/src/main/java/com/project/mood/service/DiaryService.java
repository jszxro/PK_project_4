package com.project.mood.service;

import com.project.mood.dto.DiaryDTO;
import com.project.mood.entity.Diary;
import com.project.mood.entity.Emoji;
import com.project.mood.repository.DiaryRepository;
import com.project.mood.repository.EmojiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
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
    // System.out.println("DiaryService.createDiary 시작");
    // System.out.println("받은 selectedDate: " + request.getSelectedDate());
    // System.out.println("받은 userKey: " + request.getUserKey());
    // System.out.println("받은 content: " + request.getContent());

    Emoji emoji;

    // emojiId가 있으면 그것으로 조회, 없으면 emoji 문자로 조회
    if (request.getEmojiId() != null && !request.getEmojiId().isEmpty()) {
      emoji = emojiRepository.findById(request.getEmojiId())
          .orElseThrow(() -> new RuntimeException("이모지 못 찾음"));
    } else if (request.getEmoji() != null && !request.getEmoji().isEmpty()) {
      emoji = emojiRepository.findByEmoji(request.getEmoji())
          .orElseThrow(() -> new RuntimeException("이모지 못 찾음: " + request.getEmoji()));
    } else {
      throw new RuntimeException("이모지 정보가 없습니다.");
    }

    Diary diary = new Diary();
    diary.setDiaryId(UUID.randomUUID().toString());
    diary.setUserKey(request.getUserKey());
    diary.setContent(request.getContent());
    diary.setEmoji(emoji);
    diary.setImgUrl(request.getImgUrl());

    // selectedDate가 있으면 해당 날짜로 설정, 없으면 현재 날짜
    if (request.getSelectedDate() != null) {
      LocalDateTime selectedDateTime = request.getSelectedDate().atTime(LocalTime.now());
      diary.setCreatedAt(selectedDateTime);
      System.out.println("선택된 날짜로 설정: " + selectedDateTime);
    } else {
      System.out.println("selectedDate가 null이므로 현재 날짜 사용");
    }

    System.out.println("저장 전 diary.getCreatedAt(): " + diary.getCreatedAt());
    diaryRepository.save(diary);
    System.out.println("저장 후 diary.getCreatedAt(): " + diary.getCreatedAt());
    System.out.println("=== DiaryService.createDiary 완료 ===");
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
      dto.setEmoji(d.getEmoji().getEmoji()); // 실제 이모지 문자 추가
      dto.setImgUrl(d.getImgUrl());
      dto.setCreatedAt(d.getCreatedAt());
      dto.setUpdatedAt(d.getUpdatedAt());
      // System.out.println("일기 조회 - ID: " + d.getDiaryId() + ", 이모지: " +
      // d.getEmoji().getEmoji() + ", 날짜: " + d.getCreatedAt());
      return dto;
    }).collect(Collectors.toList());
  }

  public String updateDiary(String diaryId, DiaryDTO request) {
    System.out.println("DiaryService.updateDiary 시작, diaryId = " + diaryId);

    Diary diary = diaryRepository.findById(diaryId)
        .orElseThrow(() -> new RuntimeException("일기를 찾을 수 없습니다: " + diaryId));

    // 이모지 정보 업데이트
    if (request.getEmoji() != null && !request.getEmoji().isEmpty()) {
      Emoji emoji = emojiRepository.findByEmoji(request.getEmoji())
          .orElseThrow(() -> new RuntimeException("이모지를 찾을 수 없습니다: " + request.getEmoji()));
      diary.setEmoji(emoji);
    }

    // 내용 업데이트
    if (request.getContent() != null) {
      diary.setContent(request.getContent());
    }

    // 이미지 URL 업데이트
    if (request.getImgUrl() != null) {
      diary.setImgUrl(request.getImgUrl());
    }

    // 수정 시간 업데이트
    diary.setUpdatedAt(LocalDateTime.now());

    diaryRepository.save(diary);
    // System.out.println("일기 수정 완료, diaryId = " + diaryId);
    return "수정 완료!";
  }

  public String deleteDiary(String diaryId) {
    // System.out.println("DiaryService.deleteDiary 시작, diaryId = " + diaryId);

    if (!diaryRepository.existsById(diaryId)) {
      throw new RuntimeException("일기를 찾을 수 없습니다: " + diaryId);
    }

    diaryRepository.deleteById(diaryId);
    // System.out.println("일기 삭제 완료, diaryId = " + diaryId);
    return "삭제 완료!";
  }
}
