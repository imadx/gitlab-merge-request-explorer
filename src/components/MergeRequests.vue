<script setup lang="ts">
import { onMounted } from 'vue';
import MergeRequestRecord from './MergeRequestRecord.vue';
import Users from './Users.vue';
import { store } from '../store';

const state = store.state;
onMounted(() => {
  store.dispatch('gitlab/fetchMergeRequests', 1);
});

const handlePreviousPage = () => {
  store.dispatch('gitlab/previousPage');
};

const handleNextPage = () => {
  store.dispatch('gitlab/nextPage');
};

const handleRefreshCache = () => {
  store.dispatch('gitlab/handleRefreshCache');
};
</script>

<template>
  <header>
    <div class="heading">
      <h1>GitLab</h1>
      <h3>Merge Request Explorer</h3>
    </div>
    <div class="actions">
      <span>Current page: {{ state.gitlab.currentPage || '#' }}</span>
      <button @click="handlePreviousPage">⬅</button>
      <button @click="handleNextPage">➡</button>
      <button class="button-icon" @click="handleRefreshCache">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
    <Users />
  </header>
  <MergeRequestRecord
    :key="mergeRequest.id"
    :mergeRequest="mergeRequest"
    v-for="mergeRequest in state.gitlab.mergeRequests"
  />
</template>

<style scoped lang="scss">
header {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .heading {
    flex: 1;
  }

  h1,
  h3 {
    margin: 0;
  }
}
</style>
