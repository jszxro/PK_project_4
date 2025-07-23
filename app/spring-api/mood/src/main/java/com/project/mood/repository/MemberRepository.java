package com.project.mood.repository;

import java.util.Optional;
import com.project.mood.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByUserId(String userId);

    boolean existsByUserId(String userId);

    @Query(value = "SELECT * FROM MEMBER WHERE USER_ID = :userId AND ROWNUM = 1", nativeQuery = true)
    Member findOneByUserId(@Param("userId") String userId);

    // 아이디찾기
    Optional<Member> findByUserEmail(String userEmail);

    // 비밀번호찾기
    Optional<Member> findByUserIdAndUserEmail(String userId, String userEmail);
}