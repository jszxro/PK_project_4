# openjdk 기반 이미지 slim 버전 사용
FROM openjdk:17-jdk-slim

# 시스템 패키지 설치: maven, node, npm, nano, tzdata
RUN apt update && \
    apt install -y curl nano maven tzdata && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs && \
    ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone && \
    rm -rf /var/lib/apt/lists/*

ENV TZ=Asia/Seoul

WORKDIR /workspace

EXPOSE 8080
EXPOSE 5173
EXPOSE 3000
