package com.project.mood.repository;

import java.util.Optional;
import com.project.mood.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, String> {
    Optional<Member> findByUserId(String userId);

    boolean existsByUserId(String userId);
}