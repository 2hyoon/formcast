# Step 1: schema-types

## 읽어야 할 파일

먼저 아래 파일들을 읽고 설계 의도를 파악하라:

- `/docs/PRD.md` — 지원하는 스키마 서브셋과 제약 목록
- `/docs/ARCHITECTURE.md` — 데이터 흐름과 타입의 위치
- `/CLAUDE.md` — 디렉토리 규칙
- 이전 step 산출물: `src/types/` 디렉토리 (비어 있음)

## 작업

이 프로젝트 전체에서 공유할 타입을 `src/types/schema.ts`에 정의한다. 구현 로직은 없고 타입 선언만 작성한다. 이후 step(resolver, validator, renderer)이 모두 이 타입을 import 한다.

아래 시그니처를 정의하라 (이름·구조를 그대로 따르라 — 이후 step들이 이 이름에 의존한다):

```ts
// 입력 JSON Schema (PRD의 서브셋)
export type PropertyType = "string" | "number" | "boolean";

export interface PropertySchema {
  type: PropertyType;
  title?: string;
  description?: string;
  enum?: (string | number)[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
}

export interface RootSchema {
  type: "object";
  properties: Record<string, PropertySchema>;
  required?: string[];
}

// resolver가 만들어내는 정규화된 필드
export type FieldKind = "string" | "number" | "boolean" | "enum";

export interface Field {
  key: string;            // properties의 키
  kind: FieldKind;        // enum이 있으면 "enum", 아니면 type
  label: string;          // title ?? key
  hint?: string;          // description
  required: boolean;
  options?: (string | number)[]; // kind === "enum"일 때만
  constraints: {
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
  };
}

// 폼 입력값과 검증 결과
export type FormValues = Record<string, string | number | boolean | undefined>;
export type FieldErrors = Record<string, string>; // key -> 첫 에러 메시지

// resolver 반환 타입 (성공 또는 스키마 에러)
export type ResolveResult =
  | { ok: true; fields: Field[] }
  | { ok: false; error: string };
```

## Acceptance Criteria

```bash
npm run lint     # 에러 없음
npm run build    # 타입 컴파일 에러 없음
npm run test     # exit 0 (아직 테스트 없음)
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - 타입이 `src/types/schema.ts`에 있는가?
   - 모든 타입이 `export` 되었는가?
   - PRD의 서브셋(타입·제약)을 빠짐없이 반영했는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 step 1을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "정의한 타입 이름 나열"`
   - 수정 3회 실패 → `"status": "error"` + `"error_message"`
   - 사용자 개입 필요 → `"status": "blocked"` + `"blocked_reason"` 후 중단

## 금지사항

- 런타임 로직(파싱·검증 함수)을 작성하지 마라. 이 step은 타입 선언만 한다. 이유: resolver는 step2, validator는 step3의 몫이다.
- 위 시그니처의 타입/필드 이름을 바꾸지 마라. 이유: 이후 step들이 이 이름에 의존한다.
- 중첩 객체·배열 타입을 추가하지 마라. 이유: ADR-003 — 평면 서브셋만 지원한다.
