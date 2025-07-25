package com.project.mood.service;

import com.project.mood.entity.Comments;
import com.project.mood.repository.CommentsRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentsService {

    private final CommentsRepository commentsRepository;
    // private final MemberRepository memberRepository; // 닉네임, 프로필용

    // 댓글 추가
    public void addComment(String postId, String userKey, String content) {
        Comments comment = Comments.builder()
                .commentId(UUID.randomUUID().toString())
                .postId(postId)
                .userKey(userKey)
                .content(content)
                .build();
        commentsRepository.save(comment);
    }

    // 댓글 조회 + 닉네임/프로필 포함
    public List<Map<String, Object>> getCommentsWithMemberInfo(String postId) {
        List<Object[]> rawResults = commentsRepository.findCommentsWithMemberInfoByPostId(postId);
        return rawResults.stream().map(row -> {
            Comments c = (Comments) row[0];
            String nickname = (String) row[1];
            String profile = (String) row[2];

            Map<String, Object> map = new HashMap<>();
            map.put("commentId", c.getCommentId());
            map.put("content", c.getContent());
            map.put("createdAt", c.getCreatedAt());
            map.put("nickname", nickname);
            map.put("profile", profile);
            return map;
        }).collect(Collectors.toList());
    }

    // 댓글 삭제
    public void deleteComment(String commentId) {
        Comments comment = commentsRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));
        commentsRepository.delete(comment);
    }
}