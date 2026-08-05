import type { Member } from "@/lib/api-types";

export type MemberGroup = {
  role: Member["role"];
  members: Member[];
};

const roleOrder: Member["role"][] = ["ADMIN", "MEMBER"];

export function groupProjectMembers(members: Member[]): MemberGroup[] {
  return roleOrder
    .map((role) => ({
      role,
      members: members.filter((member) => member.role === role),
    }))
    .filter((group) => group.members.length > 0);
}
