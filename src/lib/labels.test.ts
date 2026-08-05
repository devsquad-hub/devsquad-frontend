import { describe, expect, it } from "vitest";
import {
  applicationStatusLabel,
  eventLabel,
  priorityLabel,
  projectStatusLabel,
  roleLabel,
} from "./labels";

describe("presentation labels", () => {
  it("translates project lifecycle statuses", () => {
    expect(projectStatusLabel("ACTIVE")).toBe("Em andamento");
    expect(projectStatusLabel("ARCHIVED")).toBe("Arquivado");
  });

  it("translates roles and application statuses", () => {
    expect(roleLabel("MASTER")).toBe("Master do hub");
    expect(roleLabel("ADMIN")).toBe("Administrador");
    expect(applicationStatusLabel("SUBMITTED")).toBe("Em análise");
  });

  it("translates priorities and activity events without losing unknown values", () => {
    expect(priorityLabel("URGENT")).toBe("Urgente");
    expect(eventLabel("TASK_CREATED")).toBe("Tarefa criada");
    expect(eventLabel("UNRECOGNIZED_EVENT")).toBe("Unrecognized event");
  });
});
