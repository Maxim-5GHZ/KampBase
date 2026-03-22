export enum Role {
  MENTOR = "MENTOR",
  HR = "HR",
  STUDENT = "STUDENT",
}

export interface UserShortInfo {
  userId: number;
  username: string;
  name: string;
  lastName: string;
}

export interface LeaderboardEntry {
  userId: number;
  username: string;
  name: string;
  lastName: string;
  company: string | null;
  totalRate: number;
  skillPoints: number | null;
  topSkillName: string | null;
  topSkillPoints: number | null;
  skills?: Record<string, number>; // Для локальной сортировки в моках
}

export enum ArticleFormat {
  MD = "MD",
  PDF = "PDF",
}

export enum SolutionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// --- Auth Interfaces ---
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
  name: string;
  lastName: string;
  role: Role;
}

export interface JwtResponse {
  token: string;
  id: number;
  username: string;
  name: string;
  lastName: string;
  roles: string[];
}

// --- Task Interfaces ---
export interface TaskRequest {
  title: string;
  about: string;
  githubLink: string;
  skillName: string;
}

export interface Task {
  id: number;
  title: string;
  about: string;
  githubLink: string;
  skillName: string;
  author: UserShortInfo;
  isActive: boolean;
}

export interface SubmitSolutionRequest {
  commitHash: string;
}

export interface ReviewSolutionRequest {
  isApproved: boolean;
  rating: number;
}

export interface CompleteTask {
  solutionId: number;
  task: Task;
  user: UserShortInfo;
  commitHash: string;
  status: SolutionStatus;
  receivedRating: number;
}

// --- Skills & Perks Interfaces ---
export interface Perk {
  id: string;
  name: string;
  short: string;
  description: string;
  isOpen: boolean;
  parentIds: string[];
}

export interface TreeOfSkills {
  userId: number;
  rate: number;
  skills: Record<string, number>;
  unlockedPerks: string[];
}

// --- Article Interfaces ---
export interface ArticleRequest {
  title: string;
  about: string;
  format: ArticleFormat;
  link: string;
  previewPhotoLink?: string;
}

export interface Article extends ArticleRequest {
  id: number;
  author: string;
  authorId: number;
  starCount: number;
}
