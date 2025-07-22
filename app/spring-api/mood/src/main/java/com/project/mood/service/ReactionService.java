package com.project.mood.service;

import com.project.mood.entity.Reaction;
import com.project.mood.repository.ReactionRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReactionService {

    @Autowired
    private final ReactionRepository reactionRepository;

    public int getReactionType(String postId, String userKey) {
        return reactionRepository.findByPostIdAndUserKey(postId, userKey)
                .map(Reaction::getReactionType)
                .orElse(0);
    }

    public int getReactionCount(String postId) {
        return reactionRepository.countByPostIdAndReactionType(postId, 1);
    }

    @Transactional
    public int toggleReaction(String postId, String userKey) {
        Reaction reaction = reactionRepository.findByPostIdAndUserKey(postId, userKey)
                .orElse(Reaction.builder()
                        .reactionId(UUID.randomUUID().toString())
                        .postId(postId)
                        .userKey(userKey)
                        .reactionType(0)
                        .createdAt(LocalDateTime.now())
                        .build());

        int newType = reaction.getReactionType() == 1 ? 0 : 1;
        reaction.setReactionType(newType);
        reactionRepository.save(reaction);

        return newType;
    }
}
