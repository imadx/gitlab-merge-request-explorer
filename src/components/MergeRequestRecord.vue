<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-core';
import { Ref } from '@vue/reactivity';
import { getMergeRequestApprovals } from '../store/gitlab/service';
import { GitLabMergeRequest, GitLabMergeRequestApproval } from '../types/gitlab';
const props = defineProps<{ mergeRequest: GitLabMergeRequest }>();
console.log(`DEBUG ~ file: MergeRequestRecord.vue ~ line 4 ~ props`, props);

const approvalData: Ref<{ approvals: GitLabMergeRequestApproval | null }> = ref({
  approvals: null,
});
onMounted(async () => {
  approvalData.value.approvals = await (await getMergeRequestApprovals(props.mergeRequest)).data;
  console.log(
    `DEBUG ~ file: MergeRequestRecord.vue ~ line 11 ~ onMounted ~ approvals`,
    approvalData
  );
});
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
        <div class="approvers">
          <span :key="approver" v-for="approver in approvalData.approvals?.suggested_approvers">
            {{ approver.username }}
          </span>
        </div>
        <div class="merge-status">
          {{ approvalData.approvals.merge_status }}
        </div>
        <div class="merge-state">
          {{ approvalData.approvals.state }}
        </div>
        <div class="merge-state">left: {{ approvalData.approvals.approvals_left }}</div>
        <div class="merge-state">required: {{ approvalData.approvals.approvals_required }}</div>
        <div class="merge-state">approved: {{ approvalData.approvals.approved }}</div>
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
