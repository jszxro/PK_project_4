package com.project.mood.repository;

import com.project.mood.dto.PostSummaryDTO;
import com.project.mood.entity.Post;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {
    @Query(value = """
                SELECT
                    p.POST_ID AS postId,
                    m.NICKNAME AS author,
                    p.USER_KEY AS userKey,
                    p.TITLE AS title,
                    p.CONTENT AS content,
                    p.URL AS url,
                    p.IMG_URL AS imgUrl,
                    p.EMOJI_ID AS emojiId,
                    TO_CHAR(p.CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS createdAt,
                    NVL(COUNT(r.REACTION_ID), 0) AS likes
                FROM POST p
                JOIN MEMBER m ON p.USER_KEY = m.USER_KEY
                LEFT JOIN REACTION r ON p.POST_ID = r.POST_ID AND r.REACTION_TYPE = 1
                GROUP BY
                    p.POST_ID, m.NICKNAME, p.USER_KEY, p.TITLE, p.CONTENT, p.URL, p.IMG_URL, p.EMOJI_ID, p.CREATED_AT
                ORDER BY p.CREATED_AT DESC
            """, nativeQuery = true)
    List<PostSummaryDTO> findPostSummaries();
}
