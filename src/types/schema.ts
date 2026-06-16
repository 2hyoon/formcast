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
  key: string; // properties의 키
  kind: FieldKind; // enum이 있으면 "enum", 아니면 type
  label: string; // title ?? key
  hint?: string; // description
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
