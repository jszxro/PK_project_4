package com.project.mood.service;

import com.project.mood.dto.PostDTO;
import com.project.mood.dto.PostSummaryDTO;
import com.project.mood.entity.Post;
import com.project.mood.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.Optional;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public void createPost(PostDTO dto) {
        Post post = Post.builder()
                .postId(UUID.randomUUID().toString())
                .userKey(dto.getUserKey())
                .title(dto.getTitle())
                .content(dto.getContent())
                .emojiId(dto.getEmojiId())
                .url(dto.getUrl())
                .imgUrl(dto.getImgUrl())
                .build();

        postRepository.save(post);
    }

    public List<PostSummaryDTO> getPostSummaries() {
        return postRepository.findPostSummaries();
    }

    public PostDTO getPostById(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다."));

        PostDTO dto = new PostDTO();
        dto.setUserKey(post.getUserKey());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setEmojiId(post.getEmojiId());
        dto.setUrl(post.getUrl());
        dto.setImgUrl(post.getImgUrl());

        return dto;
    }

    public void updatePost(String postId, PostDTO dto) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setTitle(dto.getTitle());
            post.setContent(dto.getContent());
            post.setUrl(dto.getUrl());
            post.setUpdatedAt(LocalDateTime.now()); // 마지막 수정 시간 업데이트
            postRepository.save(post);
        } else {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다: " + postId);
        }
    }

    public void deletePost(String postId, String currentUserKey) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다."));

        if (!post.getUserKey().equals(currentUserKey)) {
            throw new SecurityException("게시글 삭제 권한이 없습니다.");
        }

        postRepository.delete(post);
    }
}
