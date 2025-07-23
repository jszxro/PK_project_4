package com.project.mood.repository;

import com.project.mood.entity.Emoji;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmojiRepository extends JpaRepository<Emoji, String> {
  Optional<Emoji> findByEmoji(String emoji);
}
