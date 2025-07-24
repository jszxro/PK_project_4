package com.project.mood.repository;

import com.project.mood.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, String> {
    Optional<Reaction> findByPostIdAndUserKey(String postId, String userKey);

    int countByPostIdAndReactionType(String postId, int reactionType);
}
