import { describe, expect, it } from "vitest";
import { resolveSchema } from "@/lib/resolver";

describe("resolveSchema", () => {
  it("정상 스키마를 Field[]로 변환한다 (label fallback, required, 제약 포함)", () => {
    const schema = JSON.stringify({
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          title: "이름",
          description: "전체 이름",
          minLength: 1,
          maxLength: 20,
        },
        age: {
          type: "number",
          minimum: 0,
          maximum: 120,
        },
      },
    });

    const result = resolveSchema(schema);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.fields).toEqual([
      {
        key: "name",
        kind: "string",
        label: "이름",
        hint: "전체 이름",
        required: true,
        constraints: { minLength: 1, maxLength: 20 },
      },
      {
        key: "age",
        kind: "number",
        label: "age", // title 없으면 key로 fallback
        hint: undefined,
        required: false,
        constraints: { minimum: 0, maximum: 120 },
      },
    ]);
  });

  it("enum이 있으면 kind는 enum, options를 채운다", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: {
        role: {
          type: "string",
          enum: ["admin", "user", "guest"],
        },
      },
    });

    const result = resolveSchema(schema);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.fields[0].kind).toBe("enum");
    expect(result.fields[0].options).toEqual(["admin", "user", "guest"]);
  });

  it("잘못된 JSON이면 ok: false", () => {
    const result = resolveSchema("{ not valid json }");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("JSON 파싱 오류");
  });

  it("최상위가 object 스키마가 아니면 ok: false", () => {
    const result = resolveSchema(JSON.stringify({ type: "string" }));
    expect(result.ok).toBe(false);
  });

  it("미지원 타입(array)이면 ok: false", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: {
        tags: { type: "array" },
      },
    });

    const result = resolveSchema(schema);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain("지원하지 않는 타입");
    expect(result.error).toContain("tags");
  });

  it("boolean 타입을 지원한다", () => {
    const schema = JSON.stringify({
      type: "object",
      properties: {
        active: { type: "boolean" },
      },
    });

    const result = resolveSchema(schema);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.fields[0].kind).toBe("boolean");
  });
});
