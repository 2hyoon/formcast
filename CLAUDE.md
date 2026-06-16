# 프로젝트: Formcast

JSON Schema를 붙여넣으면 그에 대응하는 폼과 실시간 검증을 즉석에서 보여주는 개발자용 도구.

## 기술 스택
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Vitest (테스트 러너)

## 아키텍처 규칙
- CRITICAL: JSON Schema 파싱·검증 로직은 직접 구현한다. `ajv` 등 스키마 검증 라이브러리, `react-hook-form` 등 폼 라이브러리를 도입하지 마라. 이유: 이 프로젝트의 핵심 가치는 `lib/`의 순수 로직이며, 라이브러리로 대체하면 프로젝트의 존재 이유가 사라진다.
- CRITICAL: 외부 API·DB·서버 상태가 없다. 모든 처리는 클라이언트에서 수행하고 `app/api/` 라우트를 만들지 마라.
- 디렉터리 구조: 모든 소스는 `src/` 아래에 있다.
  - `src/lib/` — 순수 로직(resolver, validator, presets). React/DOM 의존 없는 순수 함수. 단위 테스트 대상.
  - `src/components/` — React 컴포넌트
  - `src/types/` — TypeScript 타입 정의
  - `src/app/` — Next.js App Router 페이지/레이아웃
- 경로 별칭: `@` → `src/` (vitest.config.ts에 정의됨)
- 상태는 React `useState`로만 관리한다. 전역 상태 라이브러리를 도입하지 마라.

## 개발 프로세스
- CRITICAL: 순수 로직(`lib/`) 구현 시 반드시 테스트를 먼저 작성하고, 테스트가 통과하는 구현을 작성한다 (TDD). UI 컴포넌트는 빌드 통과로 검증한다.
- 테스트 파일은 `src/lib/` 안에 소스 파일과 같은 위치에 둔다 (예: `resolver.ts` 옆에 `resolver.test.ts`).
- `test` 스크립트는 테스트가 0개여도 통과해야 한다 (`vitest run --passWithNoTests`). 이유: Stop 훅이 매 세션 종료 시 `npm run test`를 실행하므로, 테스트가 아직 없는 step에서 실패하면 안 된다.
- 커밋 메시지는 conventional commits 형식을 따른다 (feat:, fix:, docs:, refactor:).

## 명령어
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (출력: .next-prod/ — dev 서버의 .next/와 분리)
npm run lint     # ESLint
npm run test     # Vitest (vitest run --passWithNoTests)
