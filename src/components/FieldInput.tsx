import type { Field } from "@/types/schema";

export interface FieldInputProps {
  field: Field;
  value: string | number | boolean | undefined;
  error?: string;
  onChange: (value: string | number | boolean) => void;
}

const baseInputClass =
  "w-full rounded-md bg-[#0f0f0f] border px-3 py-2 text-sm text-neutral-100 focus:outline-none";

export function FieldInput({
  field,
  value,
  error,
  onChange,
}: FieldInputProps): React.JSX.Element {
  const borderClass = error
    ? "border-[#ef4444]"
    : "border-neutral-800 focus:border-neutral-600";

  function renderControl(): React.JSX.Element {
    switch (field.kind) {
      case "boolean":
        return (
          <input
            type="checkbox"
            id={field.key}
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-800 bg-[#0f0f0f] accent-neutral-100"
          />
        );
      case "enum":
        return (
          <select
            id={field.key}
            value={value === undefined ? "" : String(value)}
            onChange={(e) => {
              const selected = field.options?.find(
                (opt) => String(opt) === e.target.value,
              );
              if (selected !== undefined) onChange(selected);
            }}
            className={`${baseInputClass} ${borderClass}`}
          >
            <option value="" disabled>
              선택하세요
            </option>
            {field.options?.map((opt) => (
              <option key={String(opt)} value={String(opt)}>
                {String(opt)}
              </option>
            ))}
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            id={field.key}
            value={value === undefined ? "" : String(value)}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClass} ${borderClass}`}
          />
        );
      case "string":
      default:
        return (
          <input
            type="text"
            id={field.key}
            value={value === undefined ? "" : String(value)}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClass} ${borderClass}`}
          />
        );
    }
  }

  return (
    <div className="space-y-1">
      <label htmlFor={field.key} className="block text-sm text-neutral-300">
        {field.label}
        {field.required && <span className="ml-0.5 text-[#ef4444]">*</span>}
      </label>
      {field.hint && <p className="text-xs text-neutral-500">{field.hint}</p>}
      {renderControl()}
      {error && <p className="mt-1 text-xs text-[#ef4444]">{error}</p>}
    </div>
  );
}
