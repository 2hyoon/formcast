import { describe, expect, it } from "vitest";
import { validate } from "@/lib/validator";
import type { Field } from "@/types/schema";

function stringField(overrides: Partial<Field> = {}): Field {
  return {
    key: "name",
    kind: "string",
    label: "이름",
    required: false,
    constraints: {},
    ...overrides,
  };
}

function numberField(overrides: Partial<Field> = {}): Field {
  return {
    key: "age",
    kind: "number",
    label: "나이",
    required: false,
    constraints: {},
    ...overrides,
  };
}

describe("validate", () => {
  it("required 누락이면 에러", () => {
    const fields = [stringField({ required: true })];
    expect(validate(fields, {})).toEqual({ name: "필수 항목입니다" });
    expect(validate(fields, { name: "" })).toEqual({ name: "필수 항목입니다" });
  });

  it("빈 값 + optional이면 에러 없음", () => {
    const fields = [stringField({ required: false, constraints: { minLength: 3 } })];
    expect(validate(fields, {})).toEqual({});
    expect(validate(fields, { name: "" })).toEqual({});
  });

  it("minLength 경계값 (경계는 통과, 경계-1은 실패)", () => {
    const fields = [stringField({ constraints: { minLength: 3 } })];
    expect(validate(fields, { name: "abc" })).toEqual({});
    expect(validate(fields, { name: "ab" })).toEqual({
      name: "3자 이상이어야 합니다",
    });
  });

  it("maxLength 경계값 (경계는 통과, 경계+1은 실패)", () => {
    const fields = [stringField({ constraints: { maxLength: 3 } })];
    expect(validate(fields, { name: "abc" })).toEqual({});
    expect(validate(fields, { name: "abcd" })).toEqual({
      name: "3자 이하여야 합니다",
    });
  });

  it("pattern 불일치/일치", () => {
    const fields = [stringField({ constraints: { pattern: "^[a-z]+$" } })];
    expect(validate(fields, { name: "abc" })).toEqual({});
    expect(validate(fields, { name: "ABC" })).toEqual({
      name: "형식이 올바르지 않습니다",
    });
  });

  it("number 숫자 해석 불가", () => {
    const fields = [numberField()];
    expect(validate(fields, { age: "abc" })).toEqual({
      age: "숫자를 입력하세요",
    });
  });

  it("minimum/maximum 경계값", () => {
    const fields = [numberField({ constraints: { minimum: 0, maximum: 120 } })];
    expect(validate(fields, { age: 0 })).toEqual({});
    expect(validate(fields, { age: 120 })).toEqual({});
    expect(validate(fields, { age: -1 })).toEqual({
      age: "0 이상이어야 합니다",
    });
    expect(validate(fields, { age: 121 })).toEqual({
      age: "120 이하여야 합니다",
    });
  });

  it("number 값이 문자열로 들어와도 해석한다", () => {
    const fields = [numberField({ constraints: { minimum: 10 } })];
    expect(validate(fields, { age: "20" })).toEqual({});
    expect(validate(fields, { age: "5" })).toEqual({
      age: "10 이상이어야 합니다",
    });
  });

  it("enum: options에 없는 값이면 에러", () => {
    const fields: Field[] = [
      {
        key: "role",
        kind: "enum",
        label: "역할",
        required: false,
        options: ["admin", "user"],
        constraints: {},
      },
    ];
    expect(validate(fields, { role: "admin" })).toEqual({});
    expect(validate(fields, { role: "ghost" })).toEqual({
      role: "허용된 값이 아닙니다",
    });
  });

  it("required가 minLength보다 우선 (첫 위반 하나만)", () => {
    const fields = [
      stringField({ required: true, constraints: { minLength: 3 } }),
    ];
    expect(validate(fields, {})).toEqual({ name: "필수 항목입니다" });
  });

  it("모든 필드 통과 시 빈 객체", () => {
    const fields = [
      stringField({ required: true, constraints: { minLength: 1 } }),
      numberField({ constraints: { minimum: 0 } }),
    ];
    expect(validate(fields, { name: "kim", age: 30 })).toEqual({});
  });
});
