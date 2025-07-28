package com.project.mood.repository;

import com.project.mood.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, String> {

  // 다이어리 조회
  List<Diary> findByUserKeyOrderByCreatedAtDesc(String userKey);

  // 다이어리 개수 조회
  Long countByUserKey(String userKey);

  List<Diary> findByUserKey(String userKey);

  // 오늘 다이어리 조회
  @Query("SELECT d FROM Diary d WHERE d.userKey = :userKey AND d.createdAt BETWEEN :start AND :end AND d.emoji IS NOT NULL")
  List<Diary> findTodayDiariesWithEmoji(
      @Param("userKey") String userKey,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);
}
