import { Mapping } from './store';

export interface GitLabUser {
  id: number;
  name: string;
  username: string;
  state: 'active';
  avatar_url: string;
  web_url: string;
}

export interface GitLabMergeRequest {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: 'merged' | 'active' | 'closed' | 'opened';
  created_at: string;
  updated_at: string;
  merged_by: GitLabUser;
  merged_at: string;
  closed_by: GitLabUser;
  closed_at: null;
  target_branch: string;
  source_branch: string;
  user_notes_count: number;
  upvotes: number;
  downvotes: number;
  author: GitLabUser;
  assignees: GitLabUser[];
  assignee: GitLabUser;
  reviewers: GitLabUser[];
  source_project_id: number;
  target_project_id: number;
  labels: string[];
  draft: boolean;
  work_in_progress: boolean;
  merge_when_pipeline_succeeds: boolean;
  merge_status: 'can_be_merged' | 'cannot_be_merged' | 'cannot_be_merged_recheck';
  sha: string;
  squash_commit_sha: string;
  should_remove_source_branch: boolean;
  force_remove_source_branch: boolean;
  web_url: string;
  squash: boolean;
  task_completion_status: { count: 0; completed_count: 0 };
  has_conflicts: boolean;
  blocking_discussions_resolved: boolean;
  approvals_before_merge: unknown;
}

export interface GitLabUser {
  user: {
    name: string;
    username: string;
    id: number;
    state: 'active';
    avatar_url: string;
    web_url: string;
  };
}

export interface GitLabMergeRequestApproval {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  approvals_required: 2;
  approvals_left: 1;
  approved: boolean;
  approved_by: GitLabUser[];
  suggested_approvers: GitLabUser[];
  approval_rules_left: { name: string }[];
}

export interface GitLabStore {
  mergeRequests: GitLabMergeRequest[];
  allUsers: string[];
  allUserDetails: Mapping<GitLabUser>;
  activeUsers: string[];
  currentPage: number;
  currentFetchedPage: number;
}
