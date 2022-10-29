<script setup lang="ts">
import { computed } from 'vue';
import type { Proposal as ProposalType } from '@/types';

const props = defineProps<{
  spacesStore: object;
}>();

// const currentLimit = computed(() => {
//   if (props.limit === 'off') return Infinity;

//   return props.limit || 3;
// });
</script>

<template>
  <div class="x-block mb-3">
    <div
      v-for="space in props.spacesStore.spaces"
      :key="space.id"
      class="p-4 text-skin-text border-b last:border-b-0 block"
    >
      <div class="flex justify-between">
        <div class="mb-2 flex items-center space-x-2">
          <Stamp
            :id="space.id"
            :size="24"
            class="inline-block border-skin-bg !bg-skin-bg rounded-sm"
          />
          <h4 class="inline-block" v-text="space.name" />
        </div>
        <div title="Remove subscription" >
          <i-h-trash />
        </div>
      </div>
      <div>
        https://yourwebhook.xyz/endpoint
      </div>
    </div>
  </div>
</template>
