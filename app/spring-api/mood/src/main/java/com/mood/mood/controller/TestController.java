package com.mood.mood.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.sql.DataSource;
import java.sql.Connection;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

  @Autowired
  private DataSource dataSource;

  @GetMapping("/test/db")
  public String testDatabase() {
    try (Connection connection = dataSource.getConnection()) {
      String dbName = connection.getMetaData().getDatabaseProductName();
      String dbVersion = connection.getMetaData().getDatabaseProductVersion();
      return "DB 연결 성공: " + dbName + " " + dbVersion;
    } catch (Exception e) {
      return "DB 연결 실패: " + e.getMessage();
    }
  }

  // db 콘솔 테스트
  // fetch('http://localhost:8080/test/db').then(r => r.text()).then(console.log)
  @GetMapping("/test/health")
  public String healthCheck() {
    return "Spring Boot 정상 실행 중";
  }
}
