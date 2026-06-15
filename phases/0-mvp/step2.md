# Step 2: schema-resolver

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `src/types/schema.ts` — 이 step이 사용하는 모든 타입 (특히 `RootSchema`, `Field`, `ResolveResult`)
- `/docs/ARCHITECTURE.md` — resolver의 위치와 데이터 흐름
- `/docs/PRD.md` — 지원 서브셋과 2층 에러 중 "스키마 파싱 에러"

이전 step에서 만든 `src/types/schema.ts`를 꼼꼼히 읽고, 정의된 타입 이름을 그대로 사용하라.

## 작업

**TDD로 진행한다. 테스트를 먼저 작성하고, 통과하는 구현을 작성하라.**

`src/lib/resolver.ts`에 스키마 문자열을 정규화된 필드 목록으로 변환하는 순수 함수를 구현한다. React/DOM에 의존하지 않는다.

시그니처:

```ts
import type { ResolveResult } from "@/types/schema";

export function resolveSchema(schemaText: string): ResolveResult;
```

동작 규칙:

1. `schemaText`를 `JSON.parse` 한다. 실패하면 `{ ok: false, error: "JSON 파싱 오류: <메시지>" }`.
2. 최상위가 `{ type: "object", properties: {...} }` 형태가 아니면 `{ ok: false, error: ... }`.
3. 각 property를 순회하며 `Field`로 변환한다:
   - `kind`: `enum`이 있으면 `"enum"`, 없으면 `type` 값.
   - `label`: `title ?? key`.
   - `hint`: `description`.
   - `required`: 최상위 `required` 배열에 key가 포함되면 `true`.
   - `options`: `kind === "enum"`일 때 `enum` 값을 넣는다.
   - `constraints`: 해당 제약(minLength/maxLength/minimum/maximum/pattern)을 모은다.
4. property의 `type`이 지원 목록(`string`/`number`/`boolean`)에 없으면 `{ ok: false, error: "지원하지 않는 타입: <type> (<key>)" }`.
5. 정상이면 `{ ok: true, fields }`.

**테스트(`src/lib/resolver.test.ts`)는 최소 다음 케이스를 포함하라:**
- 정상 스키마 → 올바른 `Field[]` (label fallback, required 반영, enum → kind/options 포함)
- 잘못된 JSON → `ok: false`
- 최상위가 object가 아님 → `ok: false`
- 미지원 타입(예: `"array"`) → `ok: false`

## Acceptance Criteria

```bash
npm run test     # resolver 테스트 통과
npm run lint
npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - `resolveSchema`가 순수 함수인가 (React/DOM/전역 상태 의존 없음)?
   - 위 4개 테스트 케이스가 모두 있는가?
   - `src/types/schema.ts`의 타입을 그대로 import 했는가 (재정의 금지)?
3. 결과에 따라 `phases/0-mvp/index.json`의 step 2를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "resolveSchema 구현 + 테스트 N개"`
   - 수정 3회 실패 → `"status": "error"` + `"error_message"`
   - 사용자 개입 필요 → `"status": "blocked"` + `"blocked_reason"` 후 중단

## 금지사항

- 값 검증(제약 위반 판단)을 하지 마라. 이 step은 스키마 → 필드 변환만 한다. 값 검증은 step3(validator)의 몫이다.
- `src/types/schema.ts`의 타입을 다시 정의하지 마라. import 해서 쓰라.
- ajv 등 라이브러리를 쓰지 마라. 이유: ADR-001.
- 중첩 객체·배열·`$ref`를 처리하려 하지 마라. 미지원 입력은 에러로 반환하면 된다. 이유: ADR-003.
