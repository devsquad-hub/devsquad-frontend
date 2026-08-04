export function newTaskPayload(form: FormData) {
  return {
    parentId: null,
    columnId: String(form.get("columnId")),
    milestoneId: null,
    title: String(form.get("title") ?? "").trim(),
    description: String(form.get("description") ?? "").trim(),
    priority: String(form.get("priority") ?? "NONE"),
    startDate: null,
    dueDate: form.get("dueDate") || null,
    position: 0,
    assigneeIds: form.getAll("assigneeIds").map(String),
  };
}
