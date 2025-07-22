package com.project.mood.service;

import com.project.mood.dto.PostDTO;
import com.project.mood.dto.PostSummaryDTO;
import com.project.mood.entity.Post;
import com.project.mood.repository.PostRepository;
import lombok.RequiredArgsConstructor;

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
}
