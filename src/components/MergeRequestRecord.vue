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
    <div class="title">{{ mergeRequest.title }}</div>
    <div class="details">
      <div class="detail-items">
        <div class="author">
          <img :src="mergeRequest.author.avatar_url" alt="" />
          {{ mergeRequest.author.name }}
        </div>
        <div class="approvers">
          <span>Approvers</span>
          <span :key="approver" v-for="approver in approvalData.approvals?.suggested_approvers">
            <img
              class="avatar"
              :src="state.gitlab.allUserDetails[approver.username]?.avatar_url"
              alt=""
            />
          </span>
        </div>
        <div class="approvel-rules-left">
          <span :key="rule" v-for="rule in approvalData.approvals?.approval_rules_left">
            {{ rule.name }}
          </span>
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
