# 모바일 청첩장 개발 요구사항 명세서

## 1. 프로젝트 개요

개인 결혼식용 모바일 청첩장 웹 애플리케이션. 하객들에게 결혼식 정보를 전달하고, 결혼식 당일 하객들이 찍은 사진을 수집하는 기능을 제공한다.

## 2. 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 데이터베이스 | PostgreSQL |
| ORM | Prisma 또는 Drizzle (agent 판단) |
| 파일 저장 | S3 호환 스토리지 (로컬: MinIO, 프로덕션: AWS S3 또는 Cloudflare R2) |
| S3 클라이언트 | `@aws-sdk/client-s3` v3 |
| 컨테이너 | Docker, docker-compose |
| 이미지 압축 | `browser-image-compression` (클라이언트 측) |

## 3. 인프라 구성

### 3.1 로컬 개발 환경 (docker-compose)

다음 서비스를 docker-compose로 구성한다.

```
services:
  - app          : Next.js 애플리케이션
  - postgres     : PostgreSQL 데이터베이스
  - minio        : S3 호환 파일 스토리지
  - minio-init   : 초기 실행 시 버킷 자동 생성 (mc 클라이언트 사용)
```

### 3.2 프로덕션 환경

- 프로덕션 호스팅은 미정. 추후 결정.
- S3 엔드포인트는 환경변수로 분리하여, 프로덕션 전환 시 코드 변경 없이 엔드포인트만 교체 가능해야 한다.

### 3.3 환경변수

```
# 데이터베이스
DATABASE_URL

# S3 호환 스토리지
S3_ENDPOINT           # 로컬: http://minio:9000, 프로덕션: https://...
S3_PUBLIC_ENDPOINT    # presigned URL 생성용 (브라우저 접근 가능 주소)
S3_REGION
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_BUCKET_WEDDING     # 웨딩촬영 사진 (공개)
S3_BUCKET_GUEST       # 하객 업로드 사진 (비공개)

# 관리자
ADMIN_PASSWORD        # 관리자 페이지 접근 비밀번호

# 기타
NEXT_PUBLIC_SITE_URL  # QR 코드용 URL
```

### 3.4 MinIO 주의사항

- presigned URL 생성 시 컨테이너 내부 호스트명(`minio`)이 아니라 브라우저에서 접근 가능한 외부 주소를 사용해야 한다.
- `MINIO_SERVER_URL`, `MINIO_BROWSER_REDIRECT_URL` 설정 필요.
- `minio-init` 컨테이너에서 mc 명령으로 두 버킷(`wedding`, `guest`)을 자동 생성하고, `wedding` 버킷은 public read 정책을 설정한다.

## 4. 페이지 구조 및 라우트

| 경로 | 접근 권한 | 설명 |
|---|---|---|
| `/` | 누구나 | 청첩장 메인 페이지 |
| `/upload` | 누구나 | 하객 사진 업로드 페이지 (QR 진입) |
| `/admin/login` | 누구나 | 관리자 로그인 |
| `/admin` | 관리자 | 사진 관리 대시보드 |
| `/api/*` | 내부 | API 라우트 |

## 5. 디자인 시스템

### 5.1 톤

라인 드로잉 보태니컬 (얇은 선의 식물 일러스트, 미니멀/모던)

### 5.2 컬러 팔레트

```
--color-bg          : #FAF8F5  (아이보리 배경)
--color-text        : #2A2A2A  (진한 차콜, 본문)
--color-text-sub    : #7A7A7A  (보조 텍스트)
--color-accent      : #7A8B7E  (더스티 그린, 라인/포인트)
--color-border      : #2A2A2A  (얇은 차콜 라인)
```

### 5.3 타이포그래피

- 한글 본문: **Pretendard**
- 한글 제목/장식: **Gowun Batang** 또는 **본명조**
- 영문 장식: **Cormorant Garamond** 또는 **Italiana**

### 5.4 일러스트 사용 원칙

- 얇은 선 (stroke 1~1.5px), 채색 없음
- SVG 파일로 관리
- 사용 위치: 페이지 상/하단 장식, 섹션 구분선, 이름 좌우 장식
- 여백을 충분히 두어 과하지 않게 사용

### 5.5 모바일 우선

- 기본 디자인 너비: 375px 기준
- 데스크톱에서는 중앙 정렬된 모바일 뷰포트 유지 (max-width: 480px 정도)

## 6. 기능 요구사항

### 6.1 청첩장 메인 페이지 (`/`)

다음 섹션을 세로로 배치한다.

1. **인사말 / 메인 비주얼**
   - 신랑신부 이름 (한글, 영문)
   - 결혼식 날짜 및 시간
   - 식장 이름
   - 메인 이미지 또는 라인 드로잉

2. **인사 글**
   - 신랑신부 작성 인사말 (텍스트)

3. **양가 부모님 및 신랑신부 정보**
   - 신랑 측 / 신부 측 부모님 성함
   - 신랑신부 이름

4. **웨딩사진 스와이프 갤러리**
   - 좌우 스와이프로 사진 한 장씩 전환
   - 인디케이터(점 또는 번호) 표시
   - **확대 금지**: pinch zoom, double tap zoom 차단
   - 사진은 관리자가 사전에 업로드한 것을 표시

5. **결혼식 일시 및 장소**
   - 날짜, 시간, 장소명, 주소
   - 캘린더 추가 버튼 (선택, 추후 결정)

6. **오시는 길 (지도/네비 연동)**
   - 식장 위치 지도 임베드 (네이버 또는 카카오 지도)
   - 3개 버튼: **네이버지도 / 티맵 / 카카오내비**
   - 각 버튼은 해당 앱의 URL 스킴으로 연결
   - 앱 미설치 시 fallback (앱스토어 또는 웹 지도)

7. **마음 전하실 곳 (계좌)**
   - 신랑 측 / 신부 측 토글 또는 아코디언
   - 각 인물별 은행, 계좌번호, 예금주
   - **계좌번호 복사 버튼**
   - **카카오페이 송금 버튼**: 사전 발급된 카카오페이 송금 링크를 `<a href>`로 연결 (모바일에서 앱 미설치 시 웹 폴백 자동 처리됨)

8. **하객 사진 업로드 안내**
   - QR 코드 또는 `/upload` 링크 안내
   - "결혼식 당일 찍으신 사진을 공유해주세요" 메시지

### 6.2 하객 사진 업로드 페이지 (`/upload`)

- 갤러리 없음. 업로드 폼만.
- 다중 파일 선택 가능
- 파일 선택 후 **클라이언트 측에서 압축** (`browser-image-compression`)
  - 최대 해상도: 1920px (긴 변 기준)
  - 최대 용량: 1~2MB 수준
  - 압축 진행 상태 표시
- 업로드 진행률 표시
- 업로드 완료 후 "감사합니다" 메시지
- 업로드 흐름:
  1. 클라이언트에서 압축
  2. 서버에 presigned URL 요청 (`/api/upload/presigned`)
  3. presigned URL로 직접 S3(MinIO)에 PUT
  4. 업로드 완료 후 서버에 메타데이터 저장 요청 (`/api/upload/complete`)
- 업로드 실패 시 재시도 가능
- 동일 사진 중복 업로드 방지는 하지 않음 (식별 어려움)

### 6.3 관리자 페이지 (`/admin`)

#### 6.3.1 인증

- `/admin/login`에서 비밀번호 입력
- 비밀번호는 환경변수 `ADMIN_PASSWORD`와 비교
- 인증 성공 시 httpOnly 쿠키에 세션 토큰 저장 (JWT 또는 단순 서명된 세션)
- 미인증 상태로 `/admin` 접근 시 `/admin/login`으로 리다이렉트

#### 6.3.2 기능

**A. 웨딩촬영 사진 관리**
- 사진 업로드 (다중 선택)
- 업로드 순서 변경 (드래그 또는 번호 입력)
- 사진 삭제
- 청첩장 메인의 스와이프 갤러리에 표시되는 순서를 여기서 결정

**B. 하객 업로드 사진 관리**
- 전체 사진 그리드 뷰
- 사진 클릭 시 원본 크기 보기
- **개별 다운로드**
- **전체 ZIP 다운로드** (서버에서 zip 생성 후 응답)
- 사진 삭제
- 업로드 시각 표시
- 페이지네이션 또는 무한 스크롤

### 6.4 QR 코드

- `/upload` URL을 인코딩한 QR 코드 생성
- 관리자 페이지에서 QR 이미지 다운로드 가능
- 또는 별도 스크립트로 생성 (agent 판단)

## 7. 데이터 모델

### 7.1 wedding_photos (웨딩촬영 사진)

```
id            : uuid, PK
file_key      : string  (S3 객체 키)
display_order : integer (스와이프 갤러리 순서)
created_at    : timestamp
```

### 7.2 guest_photos (하객 업로드 사진)

```
id            : uuid, PK
file_key      : string  (S3 객체 키)
original_name : string  (원본 파일명, optional)
file_size     : integer (바이트)
uploaded_at   : timestamp
```

## 8. API 라우트

| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| POST | `/api/upload/presigned` | 없음 | 하객 사진 업로드용 presigned URL 발급 |
| POST | `/api/upload/complete` | 없음 | 업로드 완료 후 메타데이터 저장 |
| POST | `/api/admin/login` | 없음 | 관리자 로그인 |
| POST | `/api/admin/logout` | 관리자 | 로그아웃 |
| GET | `/api/admin/wedding-photos` | 관리자 | 웨딩사진 목록 |
| POST | `/api/admin/wedding-photos` | 관리자 | 웨딩사진 업로드 (presigned URL 발급) |
| PATCH | `/api/admin/wedding-photos/:id` | 관리자 | 순서 변경 |
| DELETE | `/api/admin/wedding-photos/:id` | 관리자 | 삭제 |
| GET | `/api/admin/guest-photos` | 관리자 | 하객 사진 목록 |
| GET | `/api/admin/guest-photos/download` | 관리자 | 전체 ZIP 다운로드 |
| DELETE | `/api/admin/guest-photos/:id` | 관리자 | 삭제 |

## 9. 외부 앱 연동

### 9.1 지도/네비게이션 URL 스킴

- 네이버지도: `nmap://route/public?lat={lat}&lng={lng}&name={name}` (또는 search)
- 티맵: `tmap://route?goalname={name}&goalx={lng}&goaly={lat}`
- 카카오내비: `kakaonavi://navigate?name={name}&x={lng}&y={lat}&coord_type=wgs84`
- 모든 URL 스킴은 사용 직전 공식 문서 재확인 필요 (변경 가능성)

### 9.2 카카오페이 송금

- 별도 SDK 없음
- 사전 발급된 송금 링크(`https://qr.kakaopay.com/...`)를 `<a href>`로 연결
- 모바일에서 자동으로 앱 열림 / 미설치 시 웹 폴백

## 10. 사진 처리 정책

### 10.1 웨딩촬영 사진

- 관리자 업로드 시 클라이언트에서 압축 (최대 2400px, 80% quality)
- 원본 보관 안 함 (스토리지 절약)

### 10.2 하객 업로드 사진

- 클라이언트에서 압축 (최대 1920px, 1~2MB)
- 원본 보관 안 함

### 10.3 사진 확대 방지 (메인 페이지 갤러리)

다음을 모두 적용한다.

- HTML viewport meta: `user-scalable=no, maximum-scale=1`
- 이미지 컨테이너에 `touch-action: pan-x pan-y` 또는 `none`
- JavaScript로 `gesturestart` 이벤트 차단 (iOS Safari 대응)
- 이미지에 우클릭/길게 누르기 메뉴 차단 (`oncontextmenu`, CSS `-webkit-touch-callout: none`)

## 11. 보안 및 운영

- 관리자 비밀번호는 환경변수로만 관리 (코드/Git에 절대 포함 금지)
- S3 키도 환경변수
- presigned URL은 짧은 만료 시간 (5~10분)
- `wedding` 버킷: public read
- `guest` 버킷: private, 관리자 페이지에서만 presigned GET URL로 접근
- 하객 업로드 페이지에 간단한 rate limit 권장 (한 IP당 분당 N건)

## 12. 비기능 요구사항

- 모바일 우선 (대부분의 사용자가 모바일에서 접근)
- 첫 페이지 로딩: 모바일 LTE 환경에서 3초 이내 목표
- 이미지 lazy loading 적용
- Next.js Image 컴포넌트 사용 권장 (단, S3/MinIO 도메인을 `next.config.js`에 허용)
- 한국어 우선, 영문 병기 (이름 등)
- 다크모드 미지원 (청첩장 디자인 통일성)

## 13. 개발 우선순위

```
1. docker-compose 환경 구성 (app, postgres, minio, minio-init)
2. DB 스키마 및 마이그레이션
3. 디자인 시스템 (Tailwind config, 컬러, 폰트, 공통 컴포넌트)
4. 청첩장 메인 페이지 정적 섹션 (인사말, 정보, 계좌)
5. 웨딩사진 스와이프 갤러리 + 확대 방지
6. 지도/네비 버튼
7. 카카오페이 버튼
8. 하객 업로드 페이지 + presigned 업로드 흐름
9. 관리자 로그인
10. 관리자 페이지 (웨딩사진 관리)
11. 관리자 페이지 (하객 사진 관리 + ZIP 다운로드)
12. QR 코드 생성
13. 프로덕션 환경변수 분리 검증
```

## 14. 콘텐츠 데이터 (추후 채워야 할 항목)

다음 항목은 실제 콘텐츠로 채워야 한다. 개발 시점에는 placeholder 사용.

- 신랑 이름 (한글/영문)
- 신부 이름 (한글/영문)
- 결혼식 일시
- 식장명, 주소, 좌표 (위도/경도)
- 인사말 본문
- 신랑 부모님 성함
- 신부 부모님 성함
- 계좌 정보 (은행, 계좌번호, 예금주) × 인원수
- 카카오페이 송금 링크 × 인원수
- 웨딩촬영 사진 파일들
