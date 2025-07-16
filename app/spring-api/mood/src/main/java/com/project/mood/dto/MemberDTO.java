package com.project.mood.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberDTO {
    private String userId;
    private String userPw;
    private String nickname;
    private String userEmail;
}