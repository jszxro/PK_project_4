package com.project.mood.controller;

import com.project.mood.service.CommentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentsController {

    private final CommentsService commentsService;

    @PostMapping
    public ResponseEntity<String> addComment(@RequestBody Map<String, String> body, Principal principal) {
        String postId = body.get("postId");
        String content = body.get("content");

        if (principal == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String userKey = principal.getName(); // JWT 인증 시 userKey로 이름 설정했다면
        commentsService.addComment(postId, userKey, content);

        return ResponseEntity.ok("댓글 작성 완료");
    }

    // @GetMapping("/{postId}")
    // public ResponseEntity<List<Comments>> getComments(@PathVariable String
    // postId) {
    // List<Comments> comments = commentsService.getCommentsByPostId(postId);
    // return ResponseEntity.ok(comments);
    // }

    // 댓글조회
    @GetMapping("/{postId}")
    public ResponseEntity<?> getComments(@PathVariable("postId") String postId) {
        List<Map<String, Object>> comments = commentsService.getCommentsWithMemberInfo(postId);
        return ResponseEntity.ok(comments);
    }

    // 댓글삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable("commentId") String commentId) {
        commentsService.deleteComment(commentId);
        return ResponseEntity.ok("댓글이 삭제되었습니다.");
    }

    // 사용자별 댓글 조회
    @GetMapping("/user/{userKey}")
    public ResponseEntity<?> getUserComments(@PathVariable("userKey") String userKey) {
        List<Map<String, Object>> userComments = commentsService.getCommentsByUserKey(userKey);
        return ResponseEntity.ok(userComments);
    }
}
