package com.project.mood.service;

import com.project.mood.dto.MemberDTO;
import com.project.mood.entity.Member;
import com.project.mood.repository.MemberRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

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

            if (passwordEncoder.matches(rawPw, member.getUserPw())) {
                String userKey = member.getUserKey(); // ✅ userKey 가져오기
                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userKey, null,
                        authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
                return true;
            }
        }

        return false;
    }

    // 비밀번호 찾기 서비스
    public String resetPassword(String userId, String email) {
        Optional<Member> optionalMember = memberRepository.findByUserIdAndUserEmail(userId, email);

        if (optionalMember.isEmpty())
            return null;

        Member member = optionalMember.get();
        String tempPassword = String.valueOf((int) (Math.random() * 9000) + 1000); // 4자리 숫자

        member.setUserPw(passwordEncoder.encode(tempPassword));
        memberRepository.save(member);

        return tempPassword; // 프론트에 전달
    }
}
