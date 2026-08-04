export type ApplicationQuestion = {
  key: string;
  type: string;
};

export function applicationAnswers(
  form: FormData,
  questions: ApplicationQuestion[],
): Record<string, string | string[] | boolean> {
  const answers: Record<string, string | string[] | boolean> = {};

  for (const question of questions) {
    if (question.type === "BOOLEAN") {
      answers[question.key] = form.has(question.key);
      continue;
    }

    if (question.type === "MULTIPLE_CHOICE") {
      const values = form.getAll(question.key).map(String).filter(Boolean);
      if (values.length > 0) answers[question.key] = values;
      continue;
    }

    const value = String(form.get(question.key) ?? "").trim();
    if (value) answers[question.key] = value;
  }

  return answers;
}
