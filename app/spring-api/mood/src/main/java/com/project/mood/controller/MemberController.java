package com.project.mood.controller;

import com.project.mood.entity.Member;
import com.project.mood.dto.MemberDTO;
import com.project.mood.repository.MemberRepository;
import com.project.mood.service.MemberService;
import com.project.mood.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {

    private final MemberRepository memberRepository;
    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody MemberDTO dto) {
        memberService.signup(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    // 아이디 중복 체크
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Member>> checkId(@RequestParam("userId") String userId) {
        Member exists = memberRepository.findOneByUserId(userId);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<String> signin(@RequestBody MemberDTO dto) {
        boolean result = memberService.signin(dto.getUserId(), dto.getUserPw());

        if (result) {
            // 1. userKey를 조회
            Member member = memberRepository.findOneByUserId(dto.getUserId());
            String userKey = member.getUserKey();

            // 2. userKey를 토큰으로 생성
            String token = jwtUtil.createToken(userKey);

            // 3. 쿠키에 담아 응답
            ResponseCookie cookie = ResponseCookie.from("signin_info", token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body("로그인 성공");
        } else {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 틀렸습니다");
        }
    }

    // 회원정보 조회
    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@CookieValue(name = "signin_info", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(401).body("No token");
        }

        try {
            String decodedToken = URLDecoder.decode(token, StandardCharsets.UTF_8);
            String userKey = jwtUtil.getUsername(decodedToken);

            Member member = memberRepository.findById(userKey).orElse(null);
            if (member == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            return ResponseEntity.ok(member);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Invalid token");
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        ResponseCookie cookie = ResponseCookie.from("signin_info", null)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("로그아웃 성공");
    }

    // 프로필 수정
    @PutMapping("/members/update-profile")
    public ResponseEntity<?> updateProfile(
            @CookieValue(name = "signin_info", required = false) String token,
            @RequestBody MemberDTO dto) {

        if (token == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }

        try {
            String userKey = jwtUtil.getUsername(token);
            Member member = memberRepository.findById(userKey).orElse(null);

            if (member == null) {
                return ResponseEntity.status(404).body("사용자 없음");
            }

            member.setNickname(dto.getNickname());
            member.setUserEmail(dto.getUserEmail());
            member.setProfile(dto.getProfile());

            if (dto.getUserPw() != null && !dto.getUserPw().isBlank()) {
                String encryptedPw = passwordEncoder.encode(dto.getUserPw());
                member.setUserPw(encryptedPw);
            }

            memberRepository.save(member);
            return ResponseEntity.ok("프로필 수정 완료");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("수정 실패");
        }
    }
}
