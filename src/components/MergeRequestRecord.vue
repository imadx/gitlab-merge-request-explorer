<script setup lang="ts">
import { GitLabMergeRequest } from '../types/gitlab';
defineProps<{ mergeRequest: GitLabMergeRequest }>();
</script>

<template>
  <div class="merge-request-record">
    <div class="title">{{ mergeRequest.title }}</div>
    <div class="details">
      <div class="detail-items">
        <div class="author">
          <img :src="mergeRequest.author.avatar_url" alt="" />
          {{ mergeRequest.author.name }}
        </div>
      </div>
      <div class="actions">
        <a :href="mergeRequest.web_url" target="_blank">View MR</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.merge-request-record {
  text-align: left;
  margin-bottom: 1rem;

  .title {
    font-weight: bold;
    font-size: 1.1em;
  }

  .author {
    display: flex;
    align-items: center;

    img {
      width: 25px;
      height: 25px;
      border-radius: 25px;
      margin-right: 0.5rem;
      border: solid thin #333;

    }
  }

  .details {
    display: flex;
    align-items: center;
    margin-top: 0.3rem;
    .detail-items {
      flex: 1;
    }
  }
}
</style>
