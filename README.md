# Kubernetes 메트릭 모니터링 애플리케이션

## 1. 프로젝트 개요

이 프로젝트는 Kubernetes 클러스터의 상태와 메트릭을 시각적으로 모니터링하기 위한 웹 애플리케이션이다.

Python/Flask 기반의 백엔드가 Kubernetes API 서버와 통신하여 데이터를 수집하고, React 기반의 프론트엔드가 이 데이터를 사용자에게 친숙한 대시보드 형태로 제공한다.

## 2. 기술 스택

### Backend
-   **Language**: Python 3
-   **Framework**: Flask
-   **API Client**: Kubernetes Python Client
-   **Container**: Docker

### Frontend
-   **Framework**: React (with Vite)
-   **UI Library**: Material-UI (MUI)
-   **State Management**: Zustand
-   **HTTP Client**: Axios
-   **Web Server (Production)**: Nginx
-   **Container**: Docker (Multi-stage build)

### DevOps & Tools
-   **Local Environment**: Docker Compose
-   **CI/CD**: GitHub Actions

## 3. 디렉토리 구조

```
.
├── backend/                # Python/Flask 백엔드 애플리케이션
│   ├── app/                # Flask 애플리케이션 소스 코드
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # React 프론트엔드 애플리케이션
│   ├── src/                # React 애플리케이션 소스 코드
│   ├── Dockerfile.prod     # 프로덕션용 멀티-스테이지 Dockerfile
│   └── nginx.conf          # Nginx 설정 파일
├── .github/
│   └── workflows/          # GitHub Actions CI/CD 워크플로우
│       └── deploy.yml
└── docker-compose.yml      # 로컬 개발 환경 구성을 위한 Docker Compose 파일
```

## 4. 로컬 개발 환경에서 시작하기

### 사전 준비 사항
-   Docker
-   Docker Compose

### 실행 절차
1.  **리포지토리 클론**
    ```bash
    git clone <your-repository-url>
    cd k8s-metric-app
    ```

2.  **로컬 Kubernetes 설정 확인**
    백엔드 애플리케이션은 로컬의 `~/.kube/config` 파일을 사용하여 Kubernetes 클러스터에 연결을 시도한다. 로컬에서 테스트하려는 클러스터의 `kubeconfig`가 올바르게 설정되어 있는지 확인한다.

3.  **Docker Compose 실행**
    프로젝트 루트 디렉토리에서 아래 명령어를 실행하면 백엔드와 프론트엔드 서비스가 동시에 시작된다.
    ```bash
    docker-compose up --build
    ```
    -   프론트엔드: `http://localhost:5173` (Vite 개발 서버)
    -   백엔드: `http://localhost:5000`

## 5. CI/CD 파이프라인 (`.github/workflows/deploy.yml`)

이 리포지토리에는 `main` 브랜치의 `backend`, `frontend`, 또는 워크플로우 파일 자체에 변경 사항이 푸시될 때 자동으로 실행되는 CI/CD 파이프라인이 구성되어 있다.

이 파이프라인은 애플리케이션 코드를 빌드하고, 컨테이너 이미지를 생성하여 푸시한 뒤, GitOps 리포지토리의 배포 설정을 자동으로 업데이트하는 역할을 한다.

### 파이프라인 작동 방식

1.  **Build & Push (`build` job)**
    -   워크플로우가 트리거되면, 먼저 변경 사항에 대한 고유 식별자인 Git 커밋 해시(SHA)를 사용하여 Docker 이미지 태그를 생성한다.
    -   `backend`와 `frontend`의 Docker 이미지를 각각 빌드하여 GitHub Container Registry(GHCR)에 푸시한다.
    -   이미지는 두 가지 태그, 즉 고유한 커밋 해시 태그(예: `a1b2c3d`)와 `latest` 태그로 푸시된다.

2.  **Update GitOps Repository (`update-gitops` job)**
    -   `build` job이 성공적으로 완료되면, 이 job이 `k8s-gitops-configs` 리포지토리를 자동으로 체크아웃한다.
    -   `k8s-app-helm-charts/kubewatch/values.yaml` 파일 내의 이미지 태그를 방금 빌드된 새 이미지 태그(커밋 해시)로 업데이트한다.
    -   변경 사항을 `k8s-gitops-configs` 리포지토리에 커밋하고 푸시한다.
    -   이 커밋은 Argo CD에 의해 감지되며, Argo CD는 클러스터의 애플리케이션을 새로운 이미지 버전으로 자동으로 롤링 업데이트한다.

### 필수 시크릿 설정

이 파이프라인이 `k8s-gitops-configs` 리포지토리를 업데이트하려면, 이 `k8s-metric-app` 리포지토리의 `Settings > Secrets and variables > Actions`에 아래의 시크릿을 등록해야 한다.

-   `GITOPS_PAT`: `k8s-gitops-configs` 리포지토리에 대한 쓰기 권한(`repo` 스코프)을 가진 GitHub Personal Access Token.
