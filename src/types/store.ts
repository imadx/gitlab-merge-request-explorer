import { GitLabMergeRequest } from './gitlab';

export interface Store {
  count: number;
  mergeRequests: GitLabMergeRequest[];
}
