import { afterEach, describe, expect, it, vi } from "vitest";
import { mutationErrorMessage, requestMutation } from "./mutation";

describe("requestMutation", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("turns transport failures into a user-safe message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(
      requestMutation("/api/backend/v1/projects", { method: "POST" }),
    ).rejects.toThrow("Não foi possível conversar com a API. Tente novamente.");
  });

  it("keeps structured problem details from failed responses", async () => {
    const response = Response.json(
      {
        title: "Acesso negado",
        status: 403,
        detail: "Você não pode fazer isso.",
        code: "forbidden",
      },
      { status: 403 },
    );
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

    const failed = await requestMutation("/api/backend/v1/projects", {
      method: "POST",
    });
    expect(failed.ok).toBe(false);
    expect(mutationErrorMessage({ detail: "falhou" })).toBe("falhou");
  });
});
