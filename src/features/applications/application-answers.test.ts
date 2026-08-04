import { describe, expect, it } from "vitest";
import { applicationAnswers } from "./application-answers";

describe("applicationAnswers", () => {
  it("preserves boolean and multiple-choice answers", () => {
    const form = new FormData();
    form.set("motivation", "Quero contribuir");
    form.set("available", "true");
    form.append("skills", "Java");
    form.append("skills", "React");

    expect(
      applicationAnswers(form, [
        { key: "motivation", type: "LONG_TEXT" },
        { key: "available", type: "BOOLEAN" },
        { key: "skills", type: "MULTIPLE_CHOICE" },
      ]),
    ).toEqual({
      motivation: "Quero contribuir",
      available: true,
      skills: ["Java", "React"],
    });
  });

  it("omits unanswered optional values", () => {
    expect(
      applicationAnswers(new FormData(), [{ key: "portfolio", type: "URL" }]),
    ).toEqual({});
  });
});
