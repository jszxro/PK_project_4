package com.project.mood.controller;

import com.project.mood.repository.ReactionRepository;
import com.project.mood.service.ReactionService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/reactions")
@RequiredArgsConstructor
public class ReactionController {

    @Autowired
    private final ReactionService reactionService;
    @Autowired
    private final ReactionRepository reactionRepository;

    // 개별 게시글에 대한 사용자 반응 조회
    @GetMapping("/check")
    public ResponseEntity<Map<String, Integer>> checkReaction(
            @RequestParam("postId") String postId,
            @RequestParam("userKey") String userKey) {
        int reactionType = reactionService.getReactionType(postId, userKey);
        return ResponseEntity.ok(Map.of("reactionType", reactionType));
    }

    // 좋아요 토글 요청
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Integer>> toggleReaction(@RequestBody Map<String, String> payload) {
        String postId = payload.get("postId");
        String userKey = payload.get("userKey");
        int updatedType = reactionService.toggleReaction(postId, userKey);
        return ResponseEntity.ok(Map.of("reactionType", updatedType));
    }

    // 게시글별 좋아요 총합
    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getReactionCount(@RequestParam("postId") String postId) {
        long count = reactionRepository.countByPostIdAndReactionType(postId, 1);
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

}
