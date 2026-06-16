"use client";

import { useState } from "react";
import { FieldInput } from "@/components/FieldInput";
import { resolveSchema } from "@/lib/resolver";
import { validate } from "@/lib/validator";
import { presets } from "@/lib/presets";
import type { FormValues } from "@/types/schema";

export default function Home() {
  const [schemaText, setSchemaText] = useState<string>(presets[0].schema);
  const [values, setValues] = useState<FormValues>({});

  const result = resolveSchema(schemaText);
  const errors = result.ok ? validate(result.fields, values) : {};

  const hasErrors = Object.keys(errors).length > 0;

  function handleCopy(): void {
    navigator.clipboard.writeText(JSON.stringify(values, null, 2));
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-base font-semibold text-neutral-100">Formcast</h1>
        <div className="flex gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setSchemaText(preset.schema)}
              className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 왼쪽: 스키마 편집기 */}
        <section className="rounded-lg border border-neutral-800 bg-[#141414] p-4">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
            Schema
          </h2>
          <textarea
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
            spellCheck={false}
            className="h-[60vh] w-full resize-none rounded-md border border-neutral-800 bg-[#0f0f0f] px-3 py-2 font-mono text-sm text-neutral-100 focus:border-neutral-600 focus:outline-none"
          />
          {!result.ok && (
            <p className="mt-2 text-xs text-[#ef4444]">{result.error}</p>
          )}
        </section>

        {/* 오른쪽: 실시간 폼 */}
        <section className="rounded-lg border border-neutral-800 bg-[#141414] p-4">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
            Form
          </h2>
          {result.ok && (
            <>
              <div className="space-y-3">
                {result.fields.map((field) => (
                  <FieldInput
                    key={field.key}
                    field={field}
                    value={values[field.key]}
                    error={errors[field.key]}
                    onChange={(value) =>
                      setValues((prev) => ({ ...prev, [field.key]: value }))
                    }
                  />
                ))}
              </div>

              <div className="mt-6 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Result
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={hasErrors}
                    className="rounded-md bg-white px-3 py-1.5 text-sm text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    복사
                  </button>
                </div>
                <pre className="overflow-auto rounded-md border border-neutral-800 bg-[#0f0f0f] px-3 py-2 font-mono text-xs text-neutral-300">
                  {JSON.stringify(values, null, 2)}
                </pre>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
