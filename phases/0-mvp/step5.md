# Step 5: presets

## 읽어야 할 파일

먼저 아래를 읽고 설계 의도를 파악하라:

- `src/types/schema.ts` — `RootSchema` (프리셋이 따라야 할 스키마 형태)
- `src/lib/resolver.ts` — `resolveSchema` (프리셋이 이걸 통과해야 한다)
- `/docs/PRD.md` — 지원 서브셋. 프리셋은 이 범위 안의 스키마여야 한다.

## 작업

`src/lib/presets.ts`에 예제 스키마 프리셋을 상수로 정의한다. 콜드스타트(빈 화면)를 없애기 위한 것으로, 진입 시 첫 프리셋이 기본 로드된다.

시그니처:

```ts
export interface Preset {
  name: string;     // 버튼에 표시할 이름 (예: "회원가입")
  schema: string;   // JSON Schema 문자열 (들여쓰기된, 사람이 읽기 좋은 형태)
}

export const presets: Preset[];
```

요구사항:

1. 프리셋 **2~3개**를 만든다. 예: 회원가입, 설문, 배송정보.
2. 각 `schema`는 **PRD 서브셋만** 사용한다 (string/number/boolean/enum + 기본 제약). 중첩·배열 금지.
3. 각 프리셋은 서로 다른 타입을 골고루 포함해, 도구의 기능을 보여줄 것:
   - 최소 하나는 `enum`, 하나는 `number`(min/max), 하나는 `boolean`, `pattern`(예: 이메일)을 포함.
4. 각 `schema`는 들여쓰기된 JSON 문자열로 둔다 (왼쪽 편집기에 그대로 표시되므로 가독성 중요).

**테스트(`src/lib/presets.test.ts`)를 작성하라:**
- 모든 프리셋의 `schema`를 `resolveSchema`에 넣었을 때 전부 `ok: true`인지 검증한다. (프리셋이 깨진 스키마이면 안 된다.)

## Acceptance Criteria

```bash
npm run test     # 모든 프리셋이 resolveSchema를 통과
npm run lint
npm run build
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. 체크리스트:
   - 프리셋이 2~3개인가?
   - 모든 프리셋이 `resolveSchema`에서 `ok: true`인가? (테스트로 보장)
   - enum/number/boolean/pattern이 골고루 포함됐는가?
   - 서브셋을 벗어난 타입(array/중첩 object)이 없는가?
3. 결과에 따라 `phases/0-mvp/index.json`의 step 5를 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "프리셋 N개 + 검증 테스트"`
   - 수정 3회 실패 → `"status": "error"` + `"error_message"`
   - 사용자 개입 필요 → `"status": "blocked"` + `"blocked_reason"` 후 중단

## 금지사항

- 서브셋을 벗어난 스키마(중첩 객체, 배열, `$ref`)를 프리셋에 넣지 마라. 이유: resolver가 거부해 테스트가 실패한다.
- UI/렌더링 코드를 작성하지 마라. 이 step은 상수 데이터 + 검증 테스트만 만든다.
