import { getItem, setItem } from './storage';

const authHeaderKey = 'auth_header';
const projectIdKey = 'project_id';

export const getAuthHeader = (): string => {
  let authHeader = getItem<string>(authHeaderKey);
  if (authHeader) {
    return authHeader;
  }

  authHeader = prompt('Please provide your GitLab token here');
  if (!authHeader) {
    throw new Error('authHeader not set');
  }

  setItem(authHeaderKey, authHeader);
  return authHeader;
};

export const getProjectId = (): string => {
  let projectId = getItem<string>(projectIdKey);
  if (projectId) {
    return projectId;
  }

  projectId = prompt('Please provide GitLab project ID');
  if (!projectId) {
    throw new Error('projectId not set');
  }

  setItem(projectIdKey, projectId);
  return projectId;
};
