import { GitLabMergeRequest } from './gitlab';

export interface Store {
  count: number;
  mergeRequests: GitLabMergeRequest[];
}

export interface Mapping<T> {
  [key: string]: T;
}
