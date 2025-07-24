package com.project.mood.service;

import com.project.mood.entity.Comments;
import com.project.mood.repository.CommentsRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    @Autowired
    private final CommentsRepository commentsRepository;

    public void addComment(String postId, String userKey, String content) {
        Comments comment = Comments.builder()
                .commentId(UUID.randomUUID().toString())
                .postId(postId)
                .userKey(userKey)
                .content(content)
                .build();

        commentsRepository.save(comment);
    }

    public List<Comments> getCommentsByPostId(String postId) {
        return commentsRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    // 댓글조회
    public List<Map<String, Object>> getCommentsWithNickname(String postId) {
        List<Object[]> results = commentsRepository.findCommentsWithNicknameByPostId(postId);

        return results.stream().map(obj -> {
            Comments c = (Comments) obj[0];
            String nickname = (String) obj[1];
            Map<String, Object> map = new HashMap<>();
            map.put("content", c.getContent());
            map.put("createdAt", c.getCreatedAt());
            map.put("nickname", nickname);
            return map;
        }).collect(Collectors.toList());
    }
}
