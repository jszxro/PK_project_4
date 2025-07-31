package com.project.mood.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

  // 업로드 디렉토리 경로 (application.properties에서 설정 가능)
  // @Value("${file.upload.path:/workspaces/PK_project_4/app/spring-api/mood/uploads}")
  @Value("${file.upload.path:/home/pkteam/libs/uploads}")
  private String uploadPath;

  @PostMapping
  public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
    try {
      // 파일이 비어있는지 확인
      if (file.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("error", "파일이 선택되지 않았습니다."));
      }

      // 허용된 파일 타입 확인
      String contentType = file.getContentType();
      if (contentType == null || !contentType.startsWith("image/")) {
        return ResponseEntity.badRequest().body(Map.of("error", "이미지 파일만 업로드 가능합니다."));
      }

      // 파일 크기 제한 (5MB)
      if (file.getSize() > 5 * 1024 * 1024) {
        return ResponseEntity.badRequest().body(Map.of("error", "파일 크기는 5MB를 초과할 수 없습니다."));
      }

      // 업로드 디렉토리 생성
      File uploadDir = new File(uploadPath);
      if (!uploadDir.exists()) {
        uploadDir.mkdirs();
      }

      // 고유한 파일명 생성
      String originalFilename = file.getOriginalFilename();
      String fileExtension = "";
      if (originalFilename != null && originalFilename.contains(".")) {
        fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
      }

      String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
      String uniqueFilename = timestamp + "_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;

      // 파일 저장
      Path filePath = Paths.get(uploadPath, uniqueFilename);
      Files.copy(file.getInputStream(), filePath);

      // 응답 데이터 생성
      Map<String, String> response = new HashMap<>();
      response.put("url", "/uploads/" + uniqueFilename);
      response.put("filename", uniqueFilename);
      response.put("originalName", originalFilename);
      response.put("size", String.valueOf(file.getSize()));

      System.out.println("파일 업로드 성공: " + uniqueFilename);
      return ResponseEntity.ok(response);

    } catch (IOException e) {
      System.err.println("파일 업로드 실패: " + e.getMessage());
      return ResponseEntity.internalServerError().body(Map.of("error", "파일 업로드에 실패했습니다."));
    }
  }
}
