import axios, { AxiosResponse, Method } from 'axios';
import { GitLabMergeRequest, GitLabMergeRequestApproval } from '../../types/gitlab';
import { getAuthHeader, getProjectId } from '../../utils/settings';

const authHeader = getAuthHeader();
const projectId = getProjectId();

const config = {
  method: 'GET' as Method,
  url: `https://gitlab.com/api/v4/projects/${projectId}/merge_requests?state=opened&per_page=100&not[author_username]=rb-gitlab-api-dev`,
  headers: {
    Authorization: `Bearer ${authHeader}`,
  },
};

export const getFilteredMergeRequests = (
  mergeRequests: GitLabMergeRequest[],
  whitelistedUsers: string[]
): GitLabMergeRequest[] => {
  if (!whitelistedUsers.length) {
    return mergeRequests;
  }

  return mergeRequests.filter((mergeRequest) => {
    if (whitelistedUsers.includes(mergeRequest.author.username)) {
      return true;
    }

    return false;
  });
};

const getUrl = (pageIndex: number) => {
  return `${config.url}&per_page=100&page=${pageIndex}`;
};

export const getMergeRequests = async (
  pageIndex: number
): Promise<AxiosResponse<GitLabMergeRequest[]>> => {
  return axios.get<GitLabMergeRequest[]>(getUrl(pageIndex), {
    headers: config.headers,
  });
};

export const getMergeRequestApprovals = async (
  mergeRequest: GitLabMergeRequest
): Promise<AxiosResponse<GitLabMergeRequestApproval>> => {
  const projectId = getProjectId();

  return axios.get<GitLabMergeRequestApproval>(
    `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mergeRequest.iid}/approvals`,
    {
      headers: config.headers,
    }
  );
};
