package com.project.mood.controller;

import com.project.mood.dto.DiaryDTO;
import com.project.mood.service.DiaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diaries")
public class DiaryController {

    @Autowired
    private DiaryService diaryService;

    @PostMapping
    public String createDiary(@RequestBody DiaryDTO request) {
        return diaryService.createDiary(request);
    }

    @GetMapping("/user/{userKey}")
    public ResponseEntity<List<DiaryDTO>> getDiariesByUserKey(@PathVariable String userKey) {
        System.out.println("일기 불러오기 요청, userKey = " + userKey);
        List<DiaryDTO> result = diaryService.getDiariesByUserKey(userKey);
        return ResponseEntity.ok(result);
    }
}
