package com.project.mood.repository;

import java.util.Optional;
import com.project.mood.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByUserId(String userId);

    boolean existsByUserId(String userId);

    @Query(value = "SELECT * FROM MEMBER WHERE USER_ID = :userId AND ROWNUM = 1", nativeQuery = true)
    Member findOneByUserId(@Param("userId") String userId);
}