package com.project.mood.service;

import com.project.mood.dto.MemberDTO;
import com.project.mood.entity.Member;
import com.project.mood.repository.MemberRepository;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public void signup(MemberDTO dto) {
        Member member = Member.builder()
                .userKey(UUID.randomUUID().toString())
                .userId(dto.getUserId())
                .userPw(passwordEncoder.encode(dto.getUserPw()))
                .nickname(dto.getNickname())
                .userEmail(dto.getUserEmail())
                .build();

        memberRepository.save(member);
    }

    public boolean signin(String userId, String rawPw) {
        Optional<Member> optionalMember = memberRepository.findByUserId(userId);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();
            return passwordEncoder.matches(rawPw, member.getUserPw());
        }
        return false;
    }
}
