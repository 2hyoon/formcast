import type {
  Field,
  PropertySchema,
  PropertyType,
  ResolveResult,
} from "@/types/schema";

const SUPPORTED_TYPES: PropertyType[] = ["string", "number", "boolean"];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function resolveSchema(schemaText: string): ResolveResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(schemaText);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `JSON 파싱 오류: ${message}` };
  }

  if (
    !isObject(parsed) ||
    parsed.type !== "object" ||
    !isObject(parsed.properties)
  ) {
    return {
      ok: false,
      error: "스키마 오류: 최상위는 { type: \"object\", properties: {...} } 형태여야 합니다.",
    };
  }

  const properties = parsed.properties as Record<string, PropertySchema>;
  const required = Array.isArray(parsed.required)
    ? (parsed.required as string[])
    : [];

  const fields: Field[] = [];

  for (const [key, prop] of Object.entries(properties)) {
    const hasEnum = Array.isArray(prop.enum);

    if (!SUPPORTED_TYPES.includes(prop.type)) {
      return {
        ok: false,
        error: `지원하지 않는 타입: ${String(prop.type)} (${key})`,
      };
    }

    const constraints: Field["constraints"] = {};
    if (prop.minLength !== undefined) constraints.minLength = prop.minLength;
    if (prop.maxLength !== undefined) constraints.maxLength = prop.maxLength;
    if (prop.minimum !== undefined) constraints.minimum = prop.minimum;
    if (prop.maximum !== undefined) constraints.maximum = prop.maximum;
    if (prop.pattern !== undefined) constraints.pattern = prop.pattern;

    const field: Field = {
      key,
      kind: hasEnum ? "enum" : prop.type,
      label: prop.title ?? key,
      hint: prop.description,
      required: required.includes(key),
      constraints,
    };

    if (hasEnum) {
      field.options = prop.enum;
    }

    fields.push(field);
  }

  return { ok: true, fields };
}
