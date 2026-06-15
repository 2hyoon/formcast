# Step 6: form-ui

## 읽어야 할 파일

먼저 아래를 **모두** 읽고 데이터 흐름과 인터페이스를 정확히 파악한 뒤 작업하라:

- `src/types/schema.ts` — 모든 공유 타입
- `src/lib/resolver.ts` — `resolveSchema(schemaText): ResolveResult`
- `src/lib/validator.ts` — `validate(fields, values): FieldErrors`
- `src/lib/presets.ts` — `presets`
- `src/components/FieldInput.tsx` — `FieldInput` props 계약 (특히 `onChange` 값 형태)
- `/docs/ARCHITECTURE.md` — 데이터 흐름과 상태 관리 규칙
- `/docs/UI_GUIDE.md` — 레이아웃(좌우 2분할)·색상·타이포

이 step은 앞 step들의 산출물을 **조립**하는 통합 단계다. 새 도메인 로직을 만들지 말고, 이미 있는 함수/컴포넌트를 연결하라.

## 작업

`src/app/page.tsx`를 Client Component(`"use client"`)로 구현한다. ARCHITECTURE의 데이터 흐름과 PRD의 화면을 그대로 만든다.

상태 (페이지가 소유, `useState`만):
- `schemaText: string` — 초기값은 `presets[0].schema`.
- `values: FormValues` — 폼 입력값.

렌더 시 파생 계산 (별도 상태로 저장하지 말 것):
- `const result = resolveSchema(schemaText)`
- `const errors = result.ok ? validate(result.fields, values) : {}`

레이아웃 (UI_GUIDE 따름):
1. 상단 헤더: 앱 제목 + 프리셋 버튼들(`presets`). 버튼 클릭 시 `schemaText`를 해당 프리셋으로 교체.
2. **좌우 2분할.**
   - **왼쪽**: `schemaText`를 편집하는 textarea(monospace). 변경 시 `schemaText` 갱신.
     - `result.ok === false`면 그 아래 **스키마 에러 메시지**(`result.error`) 표시.
   - **오른쪽**: `result.ok`면 `result.fields`를 순회하며 각 필드를 `<FieldInput>`로 렌더.
     - 각 `FieldInput`에 `value={values[field.key]}`, `error={errors[field.key]}`, `onChange`로 `values` 갱신.
     - 하단: 현재 `values`를 `JSON.stringify(values, null, 2)`로 표시 + **복사 버튼**.
       - 복사 버튼은 `errors`가 비어 있을 때만 활성화한다 (검증된 JSON만 복사). 클릭 시 클립보드에 복사.

핵심 동작:
- 왼쪽 스키마를 수정하면 오른쪽 폼이 **즉시** 재렌더된다 (파생 계산이라 자동).
- 폼 입력 시 해당 필드 에러가 실시간 갱신된다.

## Acceptance Criteria

```bash
npm run build    # 컴파일 에러 없음
npm run lint
npm run test     # 기존 테스트 전부 통과
```

## 검증 절차

1. 위 AC 커맨드를 실행한다.
2. **수동 동작 확인** (`npm run dev` 후 코드 흐름으로 검증):
   - 진입 시 `presets[0]`가 로드되고 오른쪽에 폼이 보이는가? (콜드스타트 없음)
   - 왼쪽 스키마를 고치면 오른쪽 폼이 바뀌는가?
   - 잘못된 JSON을 넣으면 왼쪽에 스키마 에러가 뜨는가?
   - 제약 위반 값을 넣으면 해당 필드 아래 에러가 뜨고, 복사 버튼이 비활성화되는가?
3. 아키텍처 체크리스트:
   - 파생 데이터(fields, errors)를 `useState`로 저장하지 않고 렌더 시 계산하는가?
   - resolver/validator/FieldInput을 재구현하지 않고 import해 연결했는가?
   - `app/api/` 라우트를 만들지 않았는가?
4. 결과에 따라 `phases/0-mvp/index.json`의 step 6을 업데이트한다:
   - 성공 → `"status": "completed"`, `"summary": "2분할 통합 페이지 완성"`
   - 수정 3회 실패 → `"status": "error"` + `"error_message"`
   - 사용자 개입 필요 → `"status": "blocked"` + `"blocked_reason"` 후 중단

## 금지사항

- resolver·validator·FieldInput을 다시 구현하지 마라. import해서 연결만 한다. 이유: 중복 구현은 레이어 분리를 깨뜨린다.
- 파생 데이터(fields, errors)를 `useState`/`useEffect`로 별도 저장하지 마라. 렌더 시 순수 함수로 계산한다. 이유: ARCHITECTURE 상태 관리 규칙.
- `app/api/` 라우트나 서버 호출을 만들지 마라.
- UI_GUIDE 안티슬롭 스타일을 쓰지 마라. 좌우 2분할·좌측 정렬·무채색 톤을 지켜라.
- 전역 상태 라이브러리를 도입하지 마라.
