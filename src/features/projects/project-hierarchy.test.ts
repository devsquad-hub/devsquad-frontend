import { describe, expect, it } from "vitest";
import type { Member } from "@/lib/api-types";
import { groupProjectMembers } from "./project-hierarchy";

const member = (displayName: string, role: Member["role"]): Member => ({
  accountId: displayName,
  displayName,
  role,
  functionalRole: null,
});

describe("groupProjectMembers", () => {
  it("keeps administrators before contributors and preserves display order", () => {
    expect(
      groupProjectMembers([
        member("Contributor", "MEMBER"),
        member("Lead", "ADMIN"),
        member("Maintainer", "ADMIN"),
      ]),
    ).toEqual([
      {
        role: "ADMIN",
        members: [member("Lead", "ADMIN"), member("Maintainer", "ADMIN")],
      },
      { role: "MEMBER", members: [member("Contributor", "MEMBER")] },
    ]);
  });
});
