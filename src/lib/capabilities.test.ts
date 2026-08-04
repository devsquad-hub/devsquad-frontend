import { describe, expect, it } from "vitest";
import { canAccessProjectSettings, emptyCapabilities } from "./capabilities";

describe("project capabilities", () => {
  it("exibe configurações apenas quando o backend permite gerenciar o projeto", () => {
    expect(
      canAccessProjectSettings({ ...emptyCapabilities, manageProject: true }),
    ).toBe(true);
    expect(canAccessProjectSettings(emptyCapabilities)).toBe(false);
  });
});
