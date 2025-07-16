package com.project.mood.controller;

import com.project.mood.dto.MemberDTO;
import com.project.mood.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody MemberDTO dto) {
        memberService.signup(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/signin")
    public ResponseEntity<String> signin(@RequestBody MemberDTO dto) {
        boolean result = memberService.signin(dto.getUserId(), dto.getUserPw());
        if (result) {
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 틀렸습니다");
        }
    }
}