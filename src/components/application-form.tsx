"use client";

import { useState } from "react";
import { Button, Flash } from "@primer/react";
import { applicationAnswers } from "@/features/applications/application-answers";
import type { RecruitmentQuestion } from "@/lib/api-types";
import { parseProblem } from "@/lib/problem";

const defaultQuestion: RecruitmentQuestion = {
  key: "motivation",
  label: "Por que você quer participar?",
  type: "LONG_TEXT",
  required: true,
  options: [],
};

export function ApplicationForm({
  positionId,
  questions,
}: {
  positionId: string;
  questions: RecruitmentQuestion[];
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    const visibleQuestions =
      questions.length > 0 ? questions : [defaultQuestion];
    const response = await fetch(
      `/api/backend/v1/recruitment-positions/${positionId}/applications`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(applicationAnswers(form, visibleQuestions)),
      },
    );
    setSaving(false);
    if (!response.ok) {
      setError(
        parseProblem(await response.json().catch(() => undefined)).detail,
      );
      return;
    }
    setSent(true);
  }

  if (sent)
    return (
      <Flash variant="success">
        Candidatura enviada. Você pode acompanhar a decisão no painel.
      </Flash>
    );
  return (
    <form className="form-stack" onSubmit={submit}>
      {error && <Flash variant="danger">{error}</Flash>}
      {(questions.length > 0 ? questions : [defaultQuestion]).map(
        (question) => (
          <QuestionField
            question={question}
            positionId={positionId}
            key={question.key}
          />
        ),
      )}
      <div>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Enviando..." : "Enviar candidatura"}
        </Button>
      </div>
    </form>
  );
}

function QuestionField({
  question,
  positionId,
}: {
  question: RecruitmentQuestion;
  positionId: string;
}) {
  const id = `${question.key}-${positionId}`;

  if (question.type === "BOOLEAN") {
    return (
      <label className="project-meta" htmlFor={id}>
        <input
          id={id}
          name={question.key}
          type="checkbox"
          required={question.required}
        />
        {question.label}
      </label>
    );
  }

  if (question.type === "MULTIPLE_CHOICE") {
    return (
      <fieldset className="field">
        <legend>{question.label}</legend>
        {question.options.map((option) => (
          <label className="project-meta" key={option}>
            <input name={question.key} type="checkbox" value={option} />
            {option}
          </label>
        ))}
      </fieldset>
    );
  }

  if (question.type === "SINGLE_CHOICE") {
    return (
      <div className="field">
        <label htmlFor={id}>{question.label}</label>
        <select
          id={id}
          name={question.key}
          required={question.required}
          defaultValue=""
        >
          <option value="" disabled>
            Selecione
          </option>
          {question.options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="field">
      <label htmlFor={id}>{question.label}</label>
      {question.type === "LONG_TEXT" ? (
        <textarea
          id={id}
          name={question.key}
          required={question.required}
          maxLength={10_000}
        />
      ) : (
        <input
          id={id}
          name={question.key}
          type={question.type === "URL" ? "url" : "text"}
          required={question.required}
          maxLength={question.type === "URL" ? 2_000 : 500}
        />
      )}
    </div>
  );
}
