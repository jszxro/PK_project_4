# openjdk 기반 이미지 slim 버전 사용
FROM openjdk:17-jdk-slim

# 시스템 패키지 설치 : maven, node, npm, nano
RUN apt update && \
    apt install -y curl nano maven && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

EXPOSE 8080
EXPOSE 5173
EXPOSE 3000