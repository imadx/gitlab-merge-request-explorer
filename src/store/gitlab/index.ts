import { ActionContext } from 'vuex';
import { GitLabMergeRequest, GitLabStore, GitLabUser } from '../../types/gitlab';
import { Mapping, Store } from '../../types/store';
import { getItem, setItem } from '../../utils/storage';
import { getFilteredMergeRequests, getMergeRequests } from './service';

const localStorageKeyForActiveUsers = 'active_users';

const userDetailsCache: Mapping<GitLabUser> = {};

export const module = {
  state() {
    return {
      mergeRequests: [],
      allUsers: [],
      allUserDetails: {},
      activeUsers: null,
      currentPage: 1,
      currentFetchedPage: 1,
    };
  },
  mutations: {
    setMergeRequests(
      state: GitLabStore,
      { mergeRequests }: { mergeRequests: GitLabMergeRequest[] }
    ) {
      state.mergeRequests = [...mergeRequests];
    },
    setAllUsers(state: GitLabStore, { allUsers }: { allUsers: string[] }) {
      state.allUserDetails = userDetailsCache;
      state.allUsers = [...allUsers];
    },
    initializeActiveUsers(state: GitLabStore) {
      const activeUsers = getItem<string[]>(localStorageKeyForActiveUsers) || [];
      state.activeUsers = activeUsers;
    },
    toggleActiveUser(state: GitLabStore, user: string) {
      const activeUsers = new Set([...state.activeUsers]);
      if (activeUsers.has(user)) {
        activeUsers.delete(user);
      } else {
        activeUsers.add(user);
      }

      state.activeUsers = [...activeUsers];
      setItem(localStorageKeyForActiveUsers, state.activeUsers);
    },
    setPage(state: GitLabStore, page: number) {
      state.currentPage = page;
    },
    updateUserDetails(state: GitLabStore, userDetails: GitLabUser) {
      const details: Mapping<GitLabUser> = { ...state.allUserDetails };
      details[userDetails.username] = userDetails;
      state.allUserDetails = details;
    },
  },
  actions: {
    async fetchMergeRequests(context: ActionContext<GitLabStore, Store>) {
      const { currentPage } = context.state;
      const currentGitLabPageToFetch = Math.ceil((currentPage * 10) / 100);

      const localStorageKey = `merge_requests_${currentGitLabPageToFetch}`;
      const cachedResults = getItem<GitLabMergeRequest[]>(localStorageKey);
      if (cachedResults) {
        handleMergeRequestUpdate(context, cachedResults, currentPage, currentGitLabPageToFetch);
        return;
      }

      const mergeRequests = await (await getMergeRequests(currentGitLabPageToFetch)).data;
      setItem(localStorageKey, mergeRequests);
      handleMergeRequestUpdate(context, mergeRequests, currentPage, currentGitLabPageToFetch);
    },
    async previousPage(context: ActionContext<GitLabStore, Store>) {
      context.commit('setPage', Math.max(1, context.state.currentPage - 1));
      await context.dispatch('fetchMergeRequests');
    },
    async nextPage(context: ActionContext<GitLabStore, Store>) {
      context.commit('setPage', Math.min(50, context.state.currentPage + 1));
      await context.dispatch('fetchMergeRequests');
    },
    async toggleActiveUser(context: ActionContext<GitLabStore, Store>, user: string) {
      context.commit('toggleActiveUser', user);
      await context.dispatch('fetchMergeRequests');
    },
    async initializeActiveUsers(context: ActionContext<GitLabStore, Store>) {
      context.commit('initializeActiveUsers');
    },
    async updateUserDetails(context: ActionContext<GitLabStore, Store>, userDetails: GitLabUser) {
      context.commit('updateUserDetails', userDetails);
    },
  },
};

const handleMergeRequestUpdate = async (
  context: ActionContext<GitLabStore, Store>,
  mergeRequests: GitLabMergeRequest[],
  currentPage: number,
  currentGitLabPageToFetch: number
) => {
  const allUsers = getAllUsers(mergeRequests);
  context.commit('setAllUsers', { allUsers });

  if (!context.state.activeUsers) {
    await context.dispatch('initializeActiveUsers');
  }

  const filteredResults = getFilteredMergeRequests(mergeRequests, context.state.activeUsers);
  const results = getPageFromDataset(filteredResults, currentPage, currentGitLabPageToFetch);
  context.commit('setMergeRequests', { mergeRequests: results });
};

const getPageFromDataset = (
  dataset: GitLabMergeRequest[],
  currentPage: number,
  currentGitlabPage: number
) => {
  const page = currentPage - (currentGitlabPage - 1) * 10;
  return [...dataset].splice((page - 1) * 10, 10);
};

const getAllUsers = (mergeRequests: GitLabMergeRequest[]): string[] => {
  const users = new Set<string>();
  mergeRequests.forEach(({ author }) => {
    const { username } = author;

    if (!users.has(username)) {
      users.add(username);
      userDetailsCache[username] = author;
    }
  });

  return [...users];
};
