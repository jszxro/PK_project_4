package com.project.mood.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해
                .allowedOrigins("http://localhost:5173") // React dev 서버 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // 쿠키 포함 허용
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /uploads/** 경로로 요청이 오면 실제 파일 경로로 매핑
        String absolutePath = "/workspaces/PK_project_4/app/spring-api/mood/uploads/";
        System.out.println("=== 파일 경로 설정 ===");
        System.out.println("Working Directory: " + System.getProperty("user.dir"));
        System.out.println("Upload Path: " + absolutePath);
        System.out.println("File exists check: " + new java.io.File(absolutePath).exists());

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absolutePath);
    }
}