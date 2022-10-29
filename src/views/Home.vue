<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useSpacesStore } from '@/stores/spaces';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import { useWeb3 } from '@/composables/useWeb3';

const { web3, web3Account } = useWeb3();
const spacesStore = useSpacesStore();
const subscriptionsStore = useSubscriptionsStore();
const modalOpen = ref(false);

onMounted(() => {
  spacesStore.fetchAll();
});

function fetchSubscriptions() {
  subscriptionsStore.fetchAll();
  modalOpen.value = false;
}

watch(
  () => web3Account.value,
  () => {
    subscriptionsStore.fetchAll();
  }
);
</script>

<template>
  <div class="flex-auto mt-[72px] ml-0">
    <div class="py-8 mb-6 border-b hero">
      <Container class="max-w-screen-md">
        <div class="eyebrow mb-3" v-text="'Snapshot Webhooks'" />
        <h1 class="mb-5 mono">Subscribe<br />and stay up to date</h1>
      </Container>
    </div>
    <div v-if="web3Account">
      <Container class="max-w-screen-md">
        <div class="flex justify-end">
          <UiButton class="text-left h-[61px]" @click="modalOpen = true">
            Add subscription
          </UiButton>
        </div>
        <h3 class="mb-2" v-text="'Your subscriptions'" />
        <UiLoading
          v-if="web3.authLoading || !subscriptionsStore.loaded"
          class="block mb-2"
        />
      </Container>
      <Container v-if="subscriptionsStore.loaded" class="max-w-screen-md" slim>
        <SubscriptionsList
          :subscriptions="subscriptionsStore.subscriptions"
          :spaces="spacesStore.spaces"
          @fetch="fetchSubscriptions"
        />
      </Container>
    </div>
    <div v-else-if="!web3.authLoading">
      <Container class="max-w-screen-md">
        <div class="x-block my-2 p-4">
          <p class="text-skin-link">
            Manage your webhook subscriptions easily and get notified about new
            proposals on Snapshot ⚡
          </p>
          <p class="text-sm mt-2">
            Connect wallet to manage your subscriptions.
          </p>
        </div>
      </Container>
    </div>
  </div>
  <teleport v-if="spacesStore.loaded" to="#modal">
    <ModalSubscription
      :open="modalOpen"
      :spaces="spacesStore.spaces"
      @close="fetchSubscriptions"
    />
  </teleport>
</template>
