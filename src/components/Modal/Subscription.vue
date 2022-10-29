<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { isAddress } from '@ethersproject/address';
import getProvider from '@snapshot-labs/snapshot.js/src/utils/provider';
import { clone } from '@/helpers/utils';
import { validateForm } from '@/helpers/validation';
import { useWeb3 } from '@/composables/useWeb3';
import { useClient } from '@/composables/useClient';

const { send, isSending } = useClient();

const DEFAULT_FORM_STATE = {
  space: {},
  url: ''
};

const props = defineProps({
  open: Boolean,
  initialState: Object,
  spaces: Object // NOTE(zzuziak): can have multiple subs for one space - different URL, display all
});

const emit = defineEmits(['add', 'close']);

const loading = ref(false);
const ignoreFormUpdates = ref(true);

const form = reactive(clone(DEFAULT_FORM_STATE));

const url = computed(() => {
  if (form.url.value) {
    try {
      new URL(form.url.value)
    } catch (_) {
      return false;
    }
  }

  return url;
});


async function handleSubmit() {
  console.log(form)
  console.log("URL", form.url)

  // if (!isValid.value)
  //   return console.log('Invalid schema', validationResult.value);

  const result = await send({ space: form.space, url: form.url, active: 1, type: "addSubscription" });
  console.log('Result', result.success);
  if (result.success) {
    emit('emit')
  }
}

const errors = computed(() =>
  validateForm(
    {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          // format: 'url'
        },
        space: {
          type: 'object'
        }
      },
      required: ['url', 'space']
    },
    { url: form.url, space: form.space }
  )
);



watch(
  () => props.open,
  () => {
    if (props.initialState) {
      form.space = props.initialState.space;
      form.url = props.initialState.url;

      ignoreFormUpdates.value = true;
    } else {
      form.space = DEFAULT_FORM_STATE.space;
      form.url = DEFAULT_FORM_STATE.url;

      ignoreFormUpdates.value = false;
    }
  }
);
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
          <option v-for="space in spaces" :key="space.id" :value="space.id" v-text="space.name" />
        </select>
      </div>
      <div class="relative w-full">
        <UiLoading v-if="loading" class="absolute top-[14px] z-10" />
        <SIString
          v-model="form.url"
          :error="errors.url"
          :definition="{
            type: 'string',
            title: 'Your webhook url',
            examples: ['https://domain.com/endpoint']
          }"
        />
      </div>
    </div>
    <template #footer>
      <UiButton class="w-full" @click="handleSubmit">Confirm</UiButton>
    </template>
  </UiModal>
</template>
