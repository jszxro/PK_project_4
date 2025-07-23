package com.project.mood.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mood.entity.Member;
import com.project.mood.repository.MemberRepository;
import com.project.mood.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private final MemberService memberService;

    // 아이디찾기
    @PostMapping("/find-id")
    public ResponseEntity<?> findIdByEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        Optional<Member> optionalMember = memberRepository.findByUserEmail(email);
        if (optionalMember.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 이메일로 등록된 아이디가 없습니다.");
        }

        String userId = optionalMember.get().getUserId();
        return ResponseEntity.ok(Map.of("userId", userId)); // {"userId": "haribo123"}
    }

    // 비밀번호 찾기
    @PostMapping("/find-password")
    public ResponseEntity<?> findPassword(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String email = body.get("email");

        String tempPassword = memberService.resetPassword(userId, email);
        if (tempPassword == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("입력한 정보가 일치하지 않습니다.");
        }

        Map<String, String> result = new HashMap<>();
        result.put("tempPassword", tempPassword);
        return ResponseEntity.ok(result);
    }
}
