import { describe, expect, it } from "vitest";
import { newTaskPayload } from "./task-payload";

describe("newTaskPayload", () => {
  it("creates the smallest valid backend command", () => {
    const form = new FormData();
    form.set("title", "  Publicar documentação  ");
    form.set("columnId", "column-1");
    form.set("priority", "HIGH");

    expect(newTaskPayload(form)).toEqual({
      parentId: null,
      columnId: "column-1",
      milestoneId: null,
      title: "Publicar documentação",
      description: "",
      priority: "HIGH",
      startDate: null,
      dueDate: null,
      position: 0,
      assigneeIds: [],
    });
  });
});
