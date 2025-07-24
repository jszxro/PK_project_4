package com.project.mood.repository;

import com.project.mood.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentsRepository extends JpaRepository<Comments, String> {
    List<Comments> findByPostIdOrderByCreatedAtAsc(String postId);
}
