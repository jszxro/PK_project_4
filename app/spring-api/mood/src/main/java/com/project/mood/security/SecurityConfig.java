package com.project.mood.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화 (개발용)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/signup", "/login", "/signin").permitAll() // 이 경로는 인증 없이 허용
<<<<<<< HEAD
                        .anyRequest().permitAll() // 그 외는 인증필요(전부 수락으로 변경)
=======
                        .anyRequest().permitAll() // 그 외는 인증 필요
>>>>>>> 05b58c1d3a599d9ca5f2924022a9444bd84249bc
                );
        return http.build();
    }
}