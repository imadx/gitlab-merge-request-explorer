<script setup lang="ts">
import { onMounted } from 'vue';
import MergeRequestRecord from './MergeRequestRecord.vue';
import Users from './Users.vue';
import { store } from '../store';

const state = store.state;
onMounted(() => {
  console.log('mounted');
  store.dispatch('gitlab/fetchMergeRequests', 1);
});

const handlePreviousPage = () => {
  store.dispatch('gitlab/previousPage');
};

const handleNextPage = () => {
  store.dispatch('gitlab/nextPage');
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
