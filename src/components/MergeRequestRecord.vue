<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-core';
import { Ref } from '@vue/reactivity';
import { getMergeRequestApprovals } from '../store/gitlab/service';
import { GitLabMergeRequest, GitLabMergeRequestApproval } from '../types/gitlab';
import moment from 'moment';
import { store } from '../store';
const props = defineProps<{ mergeRequest: GitLabMergeRequest }>();

const approvalData: Ref<{ approvals: GitLabMergeRequestApproval | null }> = ref({
  approvals: null,
});
onMounted(async () => {
  approvalData.value.approvals = await (await getMergeRequestApprovals(props.mergeRequest)).data;
  for (const approver of approvalData.value.approvals?.suggested_approvers) {
    store.dispatch('gitlab/updateUserDetails', approver);
  }
});

const getComputed = (date: string) => {
  return moment(date).fromNow();
};

const state = store.state;
</script>

<template>
  <div class="merge-request-record">
    <div class="merge-request-record-title">{{ mergeRequest.title }}</div>
    <div class="merge-request-record-description">
      <div class="detail-item-container">
        <div class="detail-item">
          <span class="detail-item-title">AUTHOR</span>
          <div class="detail-item-description">
            <img class="avatar" :src="mergeRequest.author.avatar_url" alt="" />
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-item-title">Approvers</span>
          <div class="detail-item-description">
            <img
              :key="approver"
              v-for="approver in approvalData.approvals?.suggested_approvers"
              class="avatar"
              :src="state.gitlab.allUserDetails[approver.username]?.avatar_url"
              :alt="state.gitlab.allUserDetails[approver.username]?.username"
              :title="state.gitlab.allUserDetails[approver.username]?.username"
            />
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-item-title">Rules</span>
          <div class="detail-item-description detail-item-description--column">
            <span
              class="field"
              :key="rule"
              v-for="rule in approvalData.approvals?.approval_rules_left"
            >
              {{ rule.name }}
            </span>
          </div>
        </div>
        <div class="merge-status">status: {{ mergeRequest.merge_status }}</div>
        <div class="merge-status">has_conflicts: {{ mergeRequest.has_conflicts }}</div>
        <div class="merge-status">draft: {{ mergeRequest.draft }}</div>
        <div class="merge-status">updated_at: {{ getComputed(mergeRequest.updated_at) }}</div>
        <div class="merge-status">created_at: {{ getComputed(mergeRequest.created_at) }}</div>
        <div class="merge-state">left: {{ approvalData.approvals?.approvals_left }}</div>
        <div class="merge-state">required: {{ approvalData.approvals?.approvals_required }}</div>
        <div class="merge-state">approved: {{ approvalData.approvals?.approved }}</div>
        <div class="blocking-discussions-resolved">
          blocking_discussions_resolved: {{ mergeRequest.blocking_discussions_resolved }}
        </div>
      </div>
      <div class="actions">
        <a :href="mergeRequest.web_url" target="_blank">View MR</a>
      </div>
    </div>
  </div>
</template>
