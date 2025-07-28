package com.project.mood.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FallbackController {

    @RequestMapping(value = "/{path:[^\\.]*}") // 확장자 없는 모든 경로
    public String forward() {
        return "forward:/index.html"; // dist/index.html로 라우팅
    }
}
