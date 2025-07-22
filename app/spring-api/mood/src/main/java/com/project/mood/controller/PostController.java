package com.project.mood.controller;

import com.project.mood.dto.PostDTO;
import com.project.mood.dto.PostSummaryDTO;
import com.project.mood.service.PostService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시글 등록
    @PostMapping("/posts")
    public ResponseEntity<String> createPost(@RequestBody PostDTO dto) {
        postService.createPost(dto);
        return ResponseEntity.ok("게시글 등록 완료");
    }

    // 게시글 조회
    @GetMapping("/posts")
    public ResponseEntity<List<PostSummaryDTO>> getPosts() {
        return ResponseEntity.ok(postService.getPostSummaries());
    }

}
