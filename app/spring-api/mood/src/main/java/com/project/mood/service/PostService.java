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
}
