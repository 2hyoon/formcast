import type { Field, FormValues, FieldErrors } from "@/types/schema";

function isEmpty(value: string | number | boolean | undefined): boolean {
  return value === undefined || value === "";
}

function validateField(
  field: Field,
  value: string | number | boolean | undefined,
): string | undefined {
  if (isEmpty(value)) {
    return field.required ? "필수 항목입니다" : undefined;
  }

  const { constraints } = field;

  if (field.kind === "string") {
    const str = String(value);
    if (constraints.minLength !== undefined && str.length < constraints.minLength) {
      return `${constraints.minLength}자 이상이어야 합니다`;
    }
    if (constraints.maxLength !== undefined && str.length > constraints.maxLength) {
      return `${constraints.maxLength}자 이하여야 합니다`;
    }
    if (constraints.pattern !== undefined && !new RegExp(constraints.pattern).test(str)) {
      return "형식이 올바르지 않습니다";
    }
    return undefined;
  }

  if (field.kind === "number") {
    const num = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(num)) {
      return "숫자를 입력하세요";
    }
    if (constraints.minimum !== undefined && num < constraints.minimum) {
      return `${constraints.minimum} 이상이어야 합니다`;
    }
    if (constraints.maximum !== undefined && num > constraints.maximum) {
      return `${constraints.maximum} 이하여야 합니다`;
    }
    return undefined;
  }

  if (field.kind === "enum") {
    const options = field.options ?? [];
    if (!options.includes(value as string | number)) {
      return "허용된 값이 아닙니다";
    }
    return undefined;
  }

  return undefined;
}

export function validate(fields: Field[], values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of fields) {
    const message = validateField(field, values[field.key]);
    if (message !== undefined) {
      errors[field.key] = message;
    }
  }

  return errors;
}
