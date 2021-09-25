import { GitLabMergeRequest, GitLabStore } from './gitlab';

export interface Store {
  count: number;
  mergeRequests: GitLabMergeRequest[];
  gitlab: GitLabStore
}

export interface Mapping<T> {
  [key: string]: T;
}
