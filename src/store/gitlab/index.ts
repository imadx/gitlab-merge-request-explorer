import { Action, ActionContext } from 'vuex';
import { GitLabMergeRequest, GitLabStore } from '../../types/gitlab';
import { Store } from '../../types/store';
import { getItem, setItem } from '../../utils/storage';
import { getFilteredMergeRequests, getMergeRequests } from './actions';

export const module = {
  state() {
    return {
      mergeRequests: [],
      allUsers: [],
      activeUsers: [],
      currentPage: 1,
      currentFetchedPage: 1,
    };
  },
  mutations: {
    setMergeRequests(state: GitLabStore, { mergeRequests }: { mergeRequests: GitLabMergeRequest[] }) {
      state.mergeRequests = [...mergeRequests];
    },
    setAllUsers(state: GitLabStore, { allUsers }: { allUsers: string[] }) {
      state.allUsers = [...allUsers];
    },
    addActiveUser(state: GitLabStore, user: string) {
      if (!state.activeUsers.includes(user)) {
        state.activeUsers.push(user);
      }
    },
    removeActiveUser(state: GitLabStore, user: string) {
      const activeUsers = new Set([...state.activeUsers]);
      if (activeUsers.has(user)) {
        activeUsers.delete(user);
      }
      state.activeUsers = [...activeUsers];
    },
    setPage(state: GitLabStore, page: number) {
      state.currentPage = page;
    },
  },
  actions: {
    async fetchMergeRequests(context: ActionContext<GitLabStore, Store>) {
      const { currentPage } = context.state;
      const currentGitLabPageToFetch = Math.ceil((currentPage * 10) / 100);

      const localStorageKey = `merge_requests_${currentGitLabPageToFetch}`;
      const cachedResults = getItem<GitLabMergeRequest[]>(localStorageKey);
      if (cachedResults) {
        const results = getPageFromDataset(cachedResults, currentPage, currentGitLabPageToFetch);
        context.commit('setMergeRequests', { mergeRequests: results });
        return;
      }

      const mergeRequests = await (await getMergeRequests(currentGitLabPageToFetch)).data;
      setItem(localStorageKey, mergeRequests);

      const allUsers = getAllUsers(mergeRequests);
      context.commit('setAllUsers', { allUsers });

      const results = getPageFromDataset(mergeRequests, currentPage, currentGitLabPageToFetch);
      const filteredResults = getFilteredMergeRequests(results, context.state.activeUsers);
      context.commit('setMergeRequests', { mergeRequests: filteredResults });
    },
    async previousPage(context: ActionContext<GitLabStore, Store>) {
      context.commit('setPage', Math.max(1, context.state.currentPage - 1));
      await context.dispatch('fetchMergeRequests');
    },
    async nextPage(context: ActionContext<GitLabStore, Store>) {
      context.commit('setPage', Math.min(50, context.state.currentPage + 1));
      await context.dispatch('fetchMergeRequests');
    },
    async addActiveUser(context: ActionContext<GitLabStore, Store>, user: string) {
      context.commit('addActiveUser', user);
      await context.dispatch('fetchMergeRequests');
    },
    async removeActiveUser(context: ActionContext<GitLabStore, Store>, user: string) {
      context.commit('removeActiveUser', user);
      await context.dispatch('fetchMergeRequests');
    },
  },
};

const getPageFromDataset = (dataset: GitLabMergeRequest[], currentPage: number, currentGitlabPage: number) => {
  const page = currentPage - (currentGitlabPage - 1) * 10;
  return [...dataset].splice((page - 1) * 10, 10);
};

const getAllUsers = (mergeRequests: GitLabMergeRequest[]): string[] => {
  const users = new Set<string>();
  mergeRequests.forEach(({ author: { username } }) => {
    if (!users.has(username)) {
      users.add(username);
    }
  });

  return [...users];
};
