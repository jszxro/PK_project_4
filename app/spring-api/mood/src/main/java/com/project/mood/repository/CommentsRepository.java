package com.project.mood.repository;

import com.project.mood.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentsRepository extends JpaRepository<Comments, String> {
    List<Comments> findByPostIdOrderByCreatedAtAsc(String postId);

    @Query("SELECT c, m.nickname FROM Comments c JOIN Member m ON c.userKey = m.userKey WHERE c.postId = :postId ORDER BY c.createdAt DESC")
    List<Object[]> findCommentsWithNicknameByPostId(@Param("postId") String postId);
}
