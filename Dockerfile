# Dockerfile
# Python 공식 이미지를 베이스로 사용
FROM python:3.9-slim-buster

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt 복사 및 종속성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY app.py .

# Flask 애플리케이션이 리슨할 포트 노출
EXPOSE 5000

# 애플리케이션 실행 명령어
CMD ["python", "app.py"]
