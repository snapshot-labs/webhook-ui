<script setup>
import { useClient } from '@/composables/useClient';
import { useFlashNotification } from '@/composables/useFlashNotification';

const props = defineProps({
  open: Boolean,
  initialState: Object,
  subscription: Object
});

const { send } = useClient();
const { notify } = useFlashNotification();

const emit = defineEmits(['close', 'remove-subscription']);

async function handleDelete() {
  const result = await send({
    id: props.subscription.id,
    type: 'removeSubscription'
  });
  result.status
    ? emit('remove-subscription')
    : notify(['red', 'Something went wrong']);
  emit('close');
}
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template #header>
      <h3 v-text="'Are you sure?'" />
    </template>
    <div class="p-4">
      <p class="text-skin-link">Confirm to remove the subscription for:</p>
      <div class="my-4 mx-2">
        <div class="eyebrow mb-t" v-text="'Space'" />
        <div class="mb-2 flex items-center space-x-2">
          <Stamp
            :id="subscription.space.id"
            :size="24"
            class="inline-block border-skin-bg !bg-skin-bg rounded-sm"
          />
          <h4 class="inline-block" v-text="subscription.space.name" />
        </div>
        <div class="eyebrow mt-3" v-text="'url'" />
        <h4 class="inline-block" v-text="subscription.url" />
      </div>
    </div>
    <template #footer>
      <UiButton class="w-full" @click="handleDelete">Confirm</UiButton>
    </template>
  </UiModal>
</template>
