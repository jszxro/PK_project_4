package com.project.mood.service;

import com.project.mood.entity.Comments;
import com.project.mood.repository.CommentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentsRepository commentRepository;

    public void addComment(String postId, String userKey, String content) {
        Comments comment = Comments.builder()
                .commentId(UUID.randomUUID().toString())
                .postId(postId)
                .userKey(userKey)
                .content(content)
                .build();

        commentRepository.save(comment);
    }

    public List<Comments> getCommentsByPostId(String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }
}
