# Step 3: validator

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `src/types/schema.ts` — `Field`, `FormValues`, `FieldErrors`
- `src/lib/resolver.ts` — validator는 resolver가 만든 `Field[]`를 입력으로 받는다 (인터페이스 호환성 확인)
- `/docs/PRD.md` — 제약 목록과 2층 에러 중 "값 검증 에러"

이전 step들의 코드를 읽고 타입과 데이터 형태를 정확히 파악한 뒤 작업하라.

## 작업

**TDD로 진행한다. 테스트를 먼저 작성하고, 통과하는 구현을 작성하라.**

`src/lib/validator.ts`에 폼 입력값을 필드 제약에 따라 검증하는 순수 함수를 구현한다.

시그니처:

```ts
import type { Field, FormValues, FieldErrors } from "@/types/schema";

export function validate(fields: Field[], values: FormValues): FieldErrors;
```

검증 규칙 (위반 시 해당 key에 한국어 에러 메시지 1개를 담는다. 통과한 필드는 키 자체를 넣지 않는다):

1. `required`인데 값이 비어 있음(`undefined`/`""`) → `"필수 항목입니다"`.
2. `string`: `minLength`/`maxLength` 위반 → `"N자 이상이어야 합니다"` / `"N자 이하여야 합니다"`.
3. `string` + `pattern`: 정규식 불일치 → `"형식이 올바르지 않습니다"`.
4. `number`: 숫자로 해석 불가 → `"숫자를 입력하세요"`. `minimum`/`maximum` 위반 → `"N 이상이어야 합니다"` / `"N 이하여야 합니다"`.
5. `enum`: `options`에 없는 값 → `"허용된 값이 아닙니다"`.
6. 값이 비어 있고 `required`가 아니면 → 통과 (제약 검사 생략).

각 필드당 **첫 번째 위반 메시지 하나만** 기록한다 (`FieldErrors`는 key→string).

**테스트(`src/lib/validator.test.ts`)는 최소 다음을 포함하라:**
- required 누락
- minLength/maxLength 경계값 (정확히 경계, 경계±1)
- minimum/maximum 경계값
- pattern 불일치/일치
- 빈 값 + optional → 에러 없음
- 모든 필드 통과 → 빈 객체 `{}`

## Acceptance Criteria

```bash
npm run test     # validator 테스트 통과
npm run lint
npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - `validate`가 순수 함수인가?
   - 경계값(정확히 경계, ±1) 테스트가 있는가?
   - 통과한 필드는 `FieldErrors`에 키를 넣지 않는가?
   - resolver의 `Field` 타입과 호환되는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 step 3을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "validate 구현 + 테스트 N개"`
   - 수정 3회 실패 → `"status": "error"` + `"error_message"`
   - 사용자 개입 필요 → `"status": "blocked"` + `"blocked_reason"` 후 중단

## 금지사항

- UI/렌더링 코드를 작성하지 마라. 이 step은 순수 검증 함수만 만든다. 렌더링은 step4·6의 몫이다.
- 스키마 파싱을 다시 하지 마라. 입력은 이미 resolver가 만든 `Field[]`다.
- 한 필드에 여러 에러 메시지를 배열로 쌓지 마라. 첫 위반 하나만 기록한다. 이유: `FieldErrors`는 key→string 구조다.
- 경계값에서 off-by-one을 내지 마라. `minLength: 3`이면 길이 3은 통과, 2는 실패다.
