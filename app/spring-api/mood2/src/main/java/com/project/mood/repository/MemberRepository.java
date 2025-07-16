package com.project.mood.repository;

import com.project.mood.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByUserId(String userId);
}