<script setup>
import { useFlashNotification } from '@/composables/useFlashNotification';

const { items } = useFlashNotification();
</script>

<template>
  <div
    class="pointer-events-none fixed left-0 right-0 bottom-0 z-[60] mb-4 flex flex-col items-center space-y-2"
  >
    <TransitionGroup name="fade">
      <div v-for="item in items" :key="item.id" class="pointer-events-auto">
        <UiButton
          class="m-5 p-3 flex items-center space-x-2 rounded !bg-red !text-white"
          :class="`!bg-${item.type}`"
          @click="item.remove()"
        >
          <IH-x v-if="item.type === 'red'" class="text-sm" />
          <IH-check v-if="item.type === 'green'" class="text-sm" />
          <span>{{ item.message }}</span>
        </UiButton>
      </div>
    </TransitionGroup>
  </div>
</template>
