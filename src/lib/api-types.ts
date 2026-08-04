import type { ViewerCapabilities } from "./capabilities";

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages?: number;
};

export type Hub = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type HubMembership = {
  hubId: string;
  hubName: string;
  hubSlug: string;
  role: "MASTER" | "ADMIN" | "MEMBER";
};

export type HubMember = {
  accountId: string;
  displayName: string;
  email?: string | null;
  avatarUrl?: string | null;
  role: "MASTER" | "ADMIN" | "MEMBER";
};

export type Proposal = {
  id: string;
  hubId: string;
  authorId: string;
  authorName: string;
  content: {
    title: string;
    summary: string;
    problem?: string | null;
    proposedSolution?: string | null;
    goals?: string | null;
    desiredSkills: string[];
  };
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";
  decisionReason?: string | null;
  projectId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Member = {
  accountId: string;
  displayName: string;
  avatarUrl?: string | null;
  role: "ADMIN" | "MEMBER";
  functionalRole?: string | null;
};

export type Project = {
  id: string;
  hubId: string;
  name: string;
  slug: string;
  projectKey: string;
  summary: string;
  description?: string | null;
  status: "PLANNING" | "RECRUITING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  repositoryUrl?: string | null;
  communicationUrl?: string | null;
  tags: string[];
  totalTasks: number;
  completedTasks: number;
  members: Member[];
  viewerCapabilities?: ViewerCapabilities;
};

export type Account = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  skills: string[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  availabilityHours?: number | null;
};

export type Task = {
  id: string;
  sequence: number;
  columnId: string;
  parentId?: string | null;
  milestoneId?: string | null;
  title: string;
  description?: string | null;
  priority: string;
  position: number;
  version: number;
  dueDate?: string | null;
  startDate?: string | null;
  completedAt?: string | null;
  assignees: Array<{
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  }>;
};

export type Comment = {
  id: string;
  body: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string | null;
};

export type BoardColumn = {
  id: string;
  name: string;
  semanticGroup: string;
  position: number;
  tasks: Task[];
};

export type Board = {
  projectId: string;
  columns: BoardColumn[];
};

export type RecruitmentQuestion = {
  key: string;
  label: string;
  type:
    | "SHORT_TEXT"
    | "LONG_TEXT"
    | "URL"
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE"
    | "BOOLEAN";
  required: boolean;
  options: string[];
};

export type RecruitmentPosition = {
  id: string;
  roundName: string;
  title: string;
  description?: string | null;
  skills: string[];
  capacity: number;
  filled: number;
  closesAt?: string | null;
  questions: RecruitmentQuestion[];
};
