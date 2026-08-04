export type BoardColumnOrder = {
  id: string;
  taskIds: string[];
};

export function moveTask(
  columns: BoardColumnOrder[],
  taskId: string,
  targetColumnId: string,
  targetIndex: number,
): BoardColumnOrder[] {
  const source = columns.find((column) => column.taskIds.includes(taskId));
  if (!source) throw new Error("task_not_found");
  if (!columns.some((column) => column.id === targetColumnId))
    throw new Error("column_not_found");

  return columns.map((column) => {
    const taskIds = column.taskIds.filter((id) => id !== taskId);
    if (column.id !== targetColumnId) return { ...column, taskIds };

    const index = Math.max(0, Math.min(targetIndex, taskIds.length));
    return {
      ...column,
      taskIds: [...taskIds.slice(0, index), taskId, ...taskIds.slice(index)],
    };
  });
}
