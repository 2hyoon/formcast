# Step 4: field-renderer

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `src/types/schema.ts` — `Field`, `FieldKind`
- `/docs/UI_GUIDE.md` — 색상·입력 필드·에러 메시지 스타일 (이 step의 핵심 가드레일)
- `/docs/ARCHITECTURE.md` — 컴포넌트는 props만 받아 렌더한다 (상태는 페이지가 소유)

## 작업

`src/components/FieldInput.tsx`에 단일 필드를 렌더하는 컴포넌트를 구현한다. 상태를 소유하지 않고 props로만 동작하는 controlled 컴포넌트다.

Props 시그니처:

```ts
import type { Field } from "@/types/schema";

export interface FieldInputProps {
  field: Field;
  value: string | number | boolean | undefined;
  error?: string;
  onChange: (value: string | number | boolean) => void;
}

export function FieldInput(props: FieldInputProps): React.JSX.Element;
```

> **주의(반환 타입)**: React 19는 전역 `JSX` 네임스페이스를 제거하고 `React.JSX`로 옮겼다. strict TS + React 19 환경에서 bare `JSX.Element`는 컴파일 에러가 날 수 있으니, `React.JSX.Element`를 쓰거나 반환 타입을 생략하고 추론에 맡겨라.

렌더 규칙 (`field.kind` 기준):

- `string` → text input. `onChange`는 입력 문자열을 그대로 전달.
- `number` → number input. `onChange`는 입력 문자열을 그대로 전달한다 (숫자 파싱·검증은 validator의 몫이다. 여기서 `Number()`로 강제 변환하지 마라).
- `boolean` → checkbox. `onChange`는 boolean 전달.
- `enum` → select. `field.options`로 옵션을 만들고, `onChange`는 **선택된 옵션의 원본 값**(`field.options`의 요소, string 또는 number)을 그대로 전달한다.

공통 렌더:
- 라벨 = `field.label`. `field.required`면 라벨 옆에 `*` 표시.
- `field.hint`가 있으면 라벨 아래 힌트 텍스트.
- `error`가 있으면 입력 아래 에러 메시지 (UI_GUIDE의 에러 스타일).
- 스타일은 `UI_GUIDE.md`의 입력 필드/에러 토큰을 따른다. 에러가 있으면 입력 테두리를 에러 색으로.

## Acceptance Criteria

```bash
npm run build    # 컴파일 에러 없음
npm run lint
npm run test     # exit 0
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - 4가지 `kind`(string/number/boolean/enum)를 모두 렌더하는가?
   - 컴포넌트가 자체 상태를 갖지 않고 props로만 동작하는가?
   - UI_GUIDE의 안티슬롭 금지사항(글로우/그라데이션 텍스트/blur 등)을 어기지 않았는가?
   - number 필드에서 값을 강제 숫자 변환하지 않는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 step 4를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "FieldInput 구현 (4가지 kind)"`
   - 수정 3회 실패 → `"status": "error"` + `"error_message"`
   - 사용자 개입 필요 → `"status": "blocked"` + `"blocked_reason"` 후 중단

## 금지사항

- 컴포넌트 안에서 `useState`로 입력값을 보관하지 마라. 이유: 상태는 페이지(step6)가 소유하는 controlled 구조다.
- 검증 로직을 넣지 마라. 에러는 `error` prop으로 받아 표시만 한다. 이유: 검증은 validator(step3)의 몫이다.
- UI_GUIDE의 안티슬롭 표에 있는 스타일(blur, gradient-text, 글로우 애니메이션, 보라색 등)을 쓰지 마라.
- number 입력값을 `Number()`로 변환해 전달하지 마라. 원본 문자열을 전달한다.
