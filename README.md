# Mobile Wedding Invitation

Next.js 15 App Router 기반 모바일 청첩장 + 하객 사진 업로드 앱입니다. `requirements.md`의 요구사항을 기준으로 구현했습니다.

## 빠른 시작

```bash
cp .env.example .env
docker compose up -d
```

- 앱: http://localhost:3000
- MinIO Console: http://localhost:9001 (`minioadmin` / `minioadmin`)
- 관리자: http://localhost:3000/admin/login (`ADMIN_PASSWORD`)

## 주요 기능

- 모바일 우선 청첩장 메인 페이지와 라인 드로잉 톤 디자인 시스템
- 웨딩사진 스와이프 갤러리, 확대/컨텍스트 메뉴 방지
- 지도/네비 딥링크, 계좌 복사, 카카오페이 링크
- 하객 사진 클라이언트 압축 → presigned PUT → 메타데이터 저장
- 관리자 httpOnly 세션 로그인
- 웨딩사진 업로드/순서 변경/삭제
- 하객사진 그리드/원본 보기/개별 다운로드/전체 ZIP/삭제
- QR 코드 생성(관리자 화면 및 `npm run qr`)

## 검증 명령

로컬 Node 빌드 대신 Docker 이미지 빌드로 검증합니다.

```bash
docker build -t wedding-invitation-check .
```
