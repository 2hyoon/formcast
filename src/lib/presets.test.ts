import { describe, expect, it } from "vitest";
import { presets } from "@/lib/presets";
import { resolveSchema } from "@/lib/resolver";

describe("presets", () => {
  it("프리셋이 2~3개이다", () => {
    expect(presets.length).toBeGreaterThanOrEqual(2);
    expect(presets.length).toBeLessThanOrEqual(3);
  });

  it.each(presets)("$name 프리셋은 resolveSchema를 통과한다", (preset) => {
    const result = resolveSchema(preset.schema);
    expect(result.ok).toBe(true);
  });
});
