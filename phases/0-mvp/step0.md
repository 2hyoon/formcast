# Step 0: project-setup

## 읽어야 할 파일

먼저 아래 파일들을 읽고 프로젝트의 기획·아키텍처·기술 결정을 파악하라:

- `/CLAUDE.md`
- `/docs/PRD.md`
- `/docs/ARCHITECTURE.md`
- `/docs/ADR.md`

## 작업

Next.js 15 프로젝트를 초기화한다. 빈 프로젝트 골격만 만들고, 도메인 로직은 절대 구현하지 마라 (다음 step들의 몫이다).

요구사항:

1. **Next.js 15 (App Router) + TypeScript (strict) + Tailwind CSS** 로 세팅한다. `src/` 디렉토리 구조를 사용한다.
2. `ARCHITECTURE.md`의 디렉토리 구조에 맞춰 빈 디렉토리를 준비한다: `src/components/`, `src/types/`, `src/lib/`. (`src/app/`은 기본 생성됨. `services/`, `app/api/`는 만들지 마라.)
3. **Vitest**를 설치·설정한다. `vitest.config.ts`를 추가하고, `tsconfig` 경로 별칭(`@/*`)이 테스트에서도 동작하게 한다.
4. `package.json`의 scripts를 아래와 정확히 일치시킨다:
   - `"dev": "next dev"`
   - `"build": "next build"`
   - `"lint": "next lint"`
   - `"test": "vitest run --passWithNoTests"`
   - **주의(lint)**: Next.js 15에서 `next lint`는 deprecated다. `create-next-app`이 ESLint를 어떤 방식(`next lint` vs `eslint` flat config)으로 스캐폴딩했든, **`npm run lint`가 에러 없이 통과하는 상태**를 최종 보장하라. `next lint`가 동작하지 않으면 스캐폴딩이 만든 lint 명령(`eslint .` 등)으로 `lint` script를 맞춰도 된다. 핵심은 AC의 `npm run lint`가 통과하는 것이다.
5. 기본 페이지(`src/app/page.tsx`)는 Next 기본 생성물을 그대로 두거나, 앱 제목만 표시하는 최소 페이지로 둔다. 2분할 UI는 step6에서 만든다.

> **중요(멱등성)**: `npm run test`는 테스트 파일이 하나도 없어도 exit 0이어야 한다. 이유: Stop 훅이 매 세션 종료 시 `npm run lint && npm run build && npm run test`를 실행하므로, 빈 테스트 스위트에서 실패하면 이 step이 완료될 수 없다.

## Acceptance Criteria

```bash
npm run lint     # 에러 없음
npm run build    # 컴파일 에러 없음
npm run test     # 테스트 0개에서 exit 0 (--passWithNoTests)
```

## 검증 절차

1. 위 AC 커맨드 3개를 모두 실행하고 전부 통과하는지 확인한다.
2. 아키텍처 체크리스트:
   - `src/components/`, `src/types/`, `src/lib/`가 존재하는가?
   - `src/app/api/`, `src/services/`를 만들지 않았는가?
   - `package.json`에 ajv, react-hook-form, 상태관리 라이브러리가 없는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 step 0을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "산출물 한 줄 요약 (생성된 설정/디렉토리)"`
   - 수정 3회 실패 → `"status": "error"`, `"error_message"`
   - 사용자 개입 필요 → `"status": "blocked"`, `"blocked_reason"` 후 즉시 중단

## 금지사항

- ajv, react-hook-form, zod, 전역 상태관리 라이브러리(redux/zustand 등)를 설치하지 마라. 이유: ADR-001 — 핵심 로직은 직접 구현한다.
- `src/app/api/` 라우트를 만들지 마라. 이유: 외부 API·서버 로직이 없는 클라이언트 전용 앱이다.
- 스키마 파싱/검증/폼 로직을 구현하지 마라. 이 step은 골격만 만든다.
- `test` 스크립트에서 `--passWithNoTests`를 빼지 마라.
