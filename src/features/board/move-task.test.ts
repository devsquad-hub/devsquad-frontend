import { describe, expect, it } from "vitest";
import { moveTask } from "./move-task";

describe("moveTask", () => {
  const board = [
    { id: "todo", taskIds: ["one", "two"] },
    { id: "doing", taskIds: ["three"] },
  ];

  it("move uma tarefa entre colunas sem alterar o estado original", () => {
    const result = moveTask(board, "two", "doing", 1);

    expect(result).toEqual([
      { id: "todo", taskIds: ["one"] },
      { id: "doing", taskIds: ["three", "two"] },
    ]);
    expect(board[0].taskIds).toEqual(["one", "two"]);
  });

  it("rejeita uma tarefa que não pertence ao quadro", () => {
    expect(() => moveTask(board, "missing", "doing", 0)).toThrow(
      "task_not_found",
    );
  });
});
