package com.project.mood.repository;

import com.project.mood.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, String> {

  // 다이어리 조회
  List<Diary> findByUserKeyOrderByCreatedAtDesc(String userKey);

  // 다이어리 개수 조회
  Long countByUserKey(String userKey);

  List<Diary> findByUserKey(String userKey);
}
