package com.project.mood.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtUtil jwtUtil;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable()) // CSRF 비활성화 (개발용)
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/signup", "/login", "/signin", "/ws/**").permitAll() // 이
                                                                                                                       // 경로는
                                                                                                                       // 인증
                                                // 없이 허용
                                                .anyRequest().permitAll() // 그 외는 인증필요(전부 수락으로 변경)
                                )
                                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil),
                                                UsernamePasswordAuthenticationFilter.class)
                                .logout(logout -> logout.disable());
                return http.build();
        }
}