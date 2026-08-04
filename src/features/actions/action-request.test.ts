import { describe, expect, it } from "vitest";
import { actionRequest } from "./action-request";

describe("actionRequest", () => {
  it("omits a body and content type for payloadless actions", () => {
    expect(actionRequest()).toEqual({ method: "POST" });
  });

  it("serializes decision notes when supplied", () => {
    expect(actionRequest({ note: "Bom perfil" })).toEqual({
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ note: "Bom perfil" }),
    });
  });

  it("supports idempotent role assignments", () => {
    expect(actionRequest({ role: "ADMIN" }, "PUT")).toMatchObject({
      method: "PUT",
      body: JSON.stringify({ role: "ADMIN" }),
    });
  });
});
