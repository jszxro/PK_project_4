package com.project.mood.controller;

import com.project.mood.entity.Member;
import com.project.mood.dto.MemberDTO;
import com.project.mood.repository.MemberRepository;
import com.project.mood.service.MemberService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.project.mood.security.JwtUtil; // JwtUtil이 이 경로에 있다고 가정

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberRepository memberRepository;
    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody MemberDTO dto) {
        memberService.signup(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    // 중복회원확인
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Member>> checkId(@RequestParam("userId") String userId) {
        Member exists = memberRepository.findOneByUserId(userId); // JPA 메서드
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<String> signin(@RequestBody MemberDTO dto) {
        boolean result = memberService.signin(dto.getUserId(), dto.getUserPw());

        if (result) {
            // 1. JWT 생성
            String token = jwtUtil.createToken(dto.getUserId());

            // 2. HttpOnly 쿠키로 생성
            ResponseCookie cookie = ResponseCookie.from("signin_info", token)
                    .httpOnly(true)
                    .secure(false) // HTTPS 환경에서는 true
                    .path("/")
                    // .maxAge(60 * 60) // 1시간
                    .sameSite("Lax")
                    .build();

            // 3. 쿠키 포함 응답
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body("로그인 성공");
        } else {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 틀렸습니다");
        }
    }

    // 회원정보 가져오기
    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@CookieValue(name = "signin_info", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(401).body("No token");
        }

        try {
            String userId = jwtUtil.getUsername(token);
            Member member = memberRepository.findOneByUserId(userId);
            if (member == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            return ResponseEntity.ok(member); // Member 객체 전체 반환 (JSON으로 직렬화됨)
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Invalid token");
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        // 세션 제거
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // 쿠키 제거
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
}