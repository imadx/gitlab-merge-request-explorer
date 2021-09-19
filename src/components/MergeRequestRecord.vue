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
        <div class="detail-item--right">
          <div class="detail-item">
            <span class="detail-item-title">AUTHOR</span>
            <div class="detail-item-description">
              <img class="avatar" :src="mergeRequest.author.avatar_url" alt="" />
            </div>
          </div>
          <div class="detail-item has-revealing-content">
            <span class="detail-item-title">APPROVERS</span>
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
            <div class="detail-item revealing-content">
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
          </div>
        </div>

        <div class="detail-item">
          <span class="detail-item-title">STATUS</span>
          <div class="detail-item-description">
            <div class="merge-request-status merge-request-status--status">
              {{ mergeRequest.merge_status }}
            </div>
            <div
              v-if="mergeRequest.has_conflicts"
              class="merge-request-status merge-request-status--has-conflicts"
            >
              HAS CONFLICTS
            </div>
            <div
              v-if="mergeRequest.draft"
              class="merge-request-status merge-request-status--is-draft"
            >
              DRAFT
            </div>
            <div
              v-if="approvalData.approvals?.approved"
              class="merge-request-status merge-request-status--is-approved"
            >
              APPROVED
            </div>
            <div
              v-if="!mergeRequest.blocking_discussions_resolved"
              class="merge-request-status merge-request-status--has-blocking-discussions"
            >
              HAS BLOCKING DISCUSSIONS
            </div>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-item-title">CREATED AT</span>
          <div class="detail-item-description">
            {{ getComputed(mergeRequest.created_at) }}
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-item-title">UPDATED AT</span>
          <div class="detail-item-description">
            {{ getComputed(mergeRequest.updated_at) }}
          </div>
        </div>
        <div class="detail-item detail-item--actions">
          <span class="detail-item-title">ACTIONS</span>
          <a :href="mergeRequest.web_url" target="_blank">View MR</a>
        </div>
      </div>
    </div>
  </div>
</template>
