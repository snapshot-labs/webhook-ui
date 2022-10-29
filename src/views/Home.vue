<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSpacesStore } from '@/stores/spaces';

const spacesStore = useSpacesStore();
const modalOpen = ref(false);

onMounted(() => {
  spacesStore.fetchAll();
});
</script>

<template>
  <div>
    <div class="py-8 mb-6 border-b hero">
      <Container class="max-w-screen-md">
        <div class="eyebrow mb-3" v-text="'Snapshot Webhooks'" />
        <h1 class="mb-5 mono">Subscribe<br />and stay up to date</h1>
      </Container>
    </div>
    <Container class="max-w-screen-md">
      <div class="flex justify-end">
        <!-- TODO(zzuziak): add onClick -->
        <button class="s-button text-left h-[61px]" @click="modalOpen = true">Add subscription</button>
      </div>
      <h3 class="mb-2" v-text="'Subscriptions'" />
      <!-- TODO(zzuziak): change to subscriptions -->
      <UiLoading v-if="!spacesStore.loaded" class="block mb-2" />
    </Container>
    <Container v-if="spacesStore.loaded" class="max-w-screen-md" slim>
      <SubscriptionsList :spacesStore="spacesStore" />
    </Container>
  </div>
  <teleport v-if="spacesStore.loaded" to="#modal">
    <ModalSubscription :open="modalOpen" @close="modalOpen = false" :spaces="spacesStore.spaces" />
  </teleport>
</template>
