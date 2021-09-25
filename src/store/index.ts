import { createStore } from 'vuex';
import { GitLabStore } from '../types/gitlab';
import { Store } from '../types/store';
import { module as gitlabStore } from './gitlab';

export const store = createStore<Store>({
  state() {
    return {
      count: 0,
      mergeRequests: [],
      gitlab: {} as GitLabStore,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
  },
  modules: {
    gitlab: { namespaced: true, ...gitlabStore },
  },
});
