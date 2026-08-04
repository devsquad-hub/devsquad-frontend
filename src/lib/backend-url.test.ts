import { describe, expect, it } from "vitest";
import { buildBackendUrl } from "./backend-url";

describe("buildBackendUrl", () => {
  it("encaminha somente caminhos v1 para a origem configurada", () => {
    expect(
      buildBackendUrl("https://api.example.com/", ["v1", "projects"], "page=2"),
    ).toBe("https://api.example.com/api/v1/projects?page=2");
  });

  it("rejeita caminhos fora da API v1", () => {
    expect(() =>
      buildBackendUrl("https://api.example.com", ["admin"], ""),
    ).toThrow("backend_path_not_allowed");
  });

  it("rejeita segmentos que tentam escapar da rota", () => {
    expect(() =>
      buildBackendUrl("https://api.example.com", ["v1", "..", "admin"], ""),
    ).toThrow("backend_path_not_allowed");
  });
});
