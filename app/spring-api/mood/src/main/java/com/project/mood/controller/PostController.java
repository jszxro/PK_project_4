package com.project.mood.controller;

import com.project.mood.dto.PostDTO;
import com.project.mood.dto.PostSummaryDTO;
import com.project.mood.service.PostService;
import com.project.mood.dto.DeleteRequest;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
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

    @GetMapping("/posts/{postId}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable String postId) {
        PostDTO post = postService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<String> updatePost(@PathVariable String postId, @RequestBody PostDTO dto) {
        postService.updatePost(postId, dto);
        return ResponseEntity.ok("게시글 수정 완료");
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String postId,
            @RequestBody(required = false) DeleteRequest requestBody) {

        String userKey = requestBody != null ? requestBody.getUserKey() : null;

        postService.deletePost(postId, userKey);
        return ResponseEntity.noContent().build();
    }

}
