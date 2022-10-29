<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Subscription as SubscriptionType } from '@/types';
import type { Space as SpaceType } from '@/types';

const props = defineProps<{
  spaces: SpaceType[];
  subscriptions: SubscriptionType[];
}>();

defineEmits<{
  (e: 'fetch');
}>();

const modalOpen = ref(false);
const selectedSubscription = ref({});
const mappedSubscriptions = computed(() => {
  return Object.fromEntries(
    Object.entries(props.subscriptions).map(([id, sub]) => [
      id,
      {
        ...sub,
        space: props.spaces.find(space => space['id'] === sub.space)
      }
    ])
  );
});

function openModal(subscription) {
  selectedSubscription.value = subscription;
  modalOpen.value = true;
}
</script>

<template>
  <div v-if="props.subscriptions.length">
    <div class="x-block mb-3">
      <div
        v-for="subscription in mappedSubscriptions"
        :key="subscription.id"
        class="p-4 text-skin-text border-b last:border-b-0 block"
      >
        <div class="flex justify-between">
          <div class="mb-2 flex items-center space-x-2">
            <Stamp
              :id="subscription.space?.id"
              :size="24"
              class="inline-block border-skin-bg !bg-skin-bg rounded-sm"
            />
            <h4 class="inline-block" v-text="subscription.space?.name" />
          </div>
          <button @click="openModal(subscription)">
            <div title="Remove subscription">
              <i-h-trash />
            </div>
          </button>
        </div>
        <div v-text="subscription.url" />
      </div>
    </div>
    <teleport to="#modal">
      <ModalRemoveSubscription
        :open="modalOpen"
        :subscription="selectedSubscription"
        @close="modalOpen = false"
        @remove-subscription="$emit('fetch')"
      />
    </teleport>
  </div>
  <div v-else>
    You don't have any subscriptions yet. Subscribe to one or more spaces!
  </div>
</template>
