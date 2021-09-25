<script setup lang="ts">
import { store } from '../store';

const state = store.state;

const handleToggleActiveUser = (e: MouseEvent) => {
  const { user } = e?.target?.dataset;
  if (!user) {
    return;
  }

  store.dispatch('gitlab/toggleActiveUser', user);
};
</script>

<template>
  <details class="all-users-container">
    <summary>Users</summary>
    <details>
      <summary>All Users</summary>
      <div class="all-users">
        <button
          :key="user"
          v-for="user in state.gitlab.allUsers"
          @click="handleToggleActiveUser"
          :data-user="user"
        >
          {{ user }}
        </button>
      </div>
    </details>
    <details>
      <summary>Active Users</summary>
      <div class="active-users">
        <button
          :key="user"
          v-for="user in state.gitlab.activeUsers"
          @click="handleToggleActiveUser"
          :data-user="user"
        >
          {{ user }}
        </button>
      </div>
    </details>
  </details>
</template>
