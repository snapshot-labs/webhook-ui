<script setup>
import { reactive, computed } from 'vue';
import { clone } from '@/helpers/utils';
import { useClient } from '@/composables/useClient';
import { validateForm } from '@/helpers/validation';
import { useFlashNotification } from '@/composables/useFlashNotification';

const props = defineProps({
  open: Boolean,
  initialState: Object,
  spaces: Object
});

const DEFAULT_FORM_STATE = {
  space: '',
  url: ''
};

const { send } = useClient();
const { notify } = useFlashNotification();

const emit = defineEmits(['add', 'close']);

const form = reactive(clone(DEFAULT_FORM_STATE));

const url = computed(() => {
  if (form.url.value) {
    try {
      new URL(form.url.value);
    } catch (_) {
      return false;
    }
  }

  return url;
});

const formValid = computed(
  () => form.space !== '' && form.url && !Object.keys(errors.value).length
);

const errors = computed(() =>
  validateForm(
    {
      type: 'object',
      properties: {
        space: {
          type: 'string'
        },
        url: {
          type: 'string',
          format: 'url'
        }
      },
      additionalProperties: true,
      required: ['space', 'url']
    },
    { url: form.url, space: form.space }
  )
);

async function handleSubmit() {
  const result = await send({
    space: form.space,
    url: form.url,
    type: 'addSubscription'
  });
  if (!result.status) notify(['red', 'Something went wrong']);
  emit('close');
}
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template #header>
      <h3 v-text="'Add subscription'" />
    </template>
    <div class="s-box p-4">
      <div class="s-base">
        <div class="s-label" v-text="'Space'" />
        <select v-model="form.space" class="s-input h-[45px] w-full">
          <option
            v-for="space in props.spaces"
            :key="space.id"
            :value="space.id"
            :error="errors.space"
            v-text="space.name"
          />
        </select>
      </div>
      <div class="relative w-full">
        <SIString
          v-model="form.url"
          :definition="{
            type: 'string',
            title: 'Your webhook url',
            examples: ['https://domain.com/endpoint']
          }"
          :error="errors.url"
        />
      </div>
    </div>
    <template #footer>
      <UiButton class="w-full" :disabled="!formValid" @click="handleSubmit">
        Confirm
      </UiButton>
    </template>
  </UiModal>
</template>
