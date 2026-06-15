# 아키텍처

## 디렉토리 구조
```
src/
├── app/               # 페이지 (단일 페이지). API 라우트 없음.
├── components/        # UI 컴포넌트 (필드 렌더러, 패널 등)
├── types/             # JSON Schema / 필드 / 검증 결과 타입 정의
└── lib/               # 순수 로직 (resolver, validator, presets)
```

> `services/`는 두지 않는다. 이 프로젝트는 외부 API를 호출하지 않는다.

## 패턴
- 페이지 루트만 Client Component (`"use client"`). 입력 상태를 다루기 때문.
- 순수 로직은 `lib/`의 순수 함수로 격리한다 — React/DOM에 의존하지 않으며 단위 테스트로 검증한다.
- UI 컴포넌트는 props로 데이터를 받아 렌더만 한다 (상태는 페이지가 소유).

## 데이터 흐름
```
[스키마 텍스트]
   │  JSON.parse + 스키마 검사
   ▼
resolver (lib/, 순수)  ──파싱 실패──▶ 스키마 에러 메시지 (왼쪽 패널)
   │  정규화된 필드 목록 [{ key, type, label, hint, constraints }]
   ▼
field-renderer (components/)  ◀── 사용자 입력값 (useState)
   │  타입별 입력 필드 렌더
   ▼
validator (lib/, 순수)  ── 값 + 제약 → 필드별 에러[]
   │
   ▼
[결과 JSON + 복사 버튼]   ← form-ui(페이지)가 전체를 조립
```

좌우 분할(왼쪽=원인, 오른쪽=결과)이 곧 데이터 흐름 방향과 일치한다.

## 상태 관리
- 스키마 텍스트, 폼 입력값 모두 페이지의 `useState`로 관리한다.
- 파생 데이터(필드 목록, 검증 에러)는 렌더 시점에 순수 함수로 계산한다. 별도 상태로 저장하지 않는다.
- 전역 상태 라이브러리, 서버 상태 라이브러리는 쓰지 않는다.
