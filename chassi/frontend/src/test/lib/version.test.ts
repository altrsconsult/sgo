import { describe, it, expect } from "vitest";
import { CHASSIS_VERSION } from "@/version";

describe("CHASSIS_VERSION", () => {
  it("deve ser uma string no formato semver x.y.z", () => {
    expect(CHASSIS_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("não deve ser string vazia", () => {
    expect(CHASSIS_VERSION.length).toBeGreaterThan(0);
  });
});
