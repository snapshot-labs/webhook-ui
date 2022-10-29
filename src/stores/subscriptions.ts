import { defineStore } from 'pinia';
import type { Subscription } from '@/types';
import { useWeb3 } from '@/composables/useWeb3';

const { web3Account } = useWeb3();

export const useSubscriptionsStore = defineStore('subscriptions', {
  state: () => ({
    loading: false,
    loaded: false,
    subscriptions: [] as Subscription[]
  }),
  actions: {
    async fetchAll() {
      if (this.loading || !web3Account.value) return;
      this.loading = true;

      const snapshotWebhookUrl =
        process.env.SNAPSHOT_WEBHOOK_API ?? 'http://localhost:3000';
      const url = `${snapshotWebhookUrl}/api/subscriptions/${web3Account.value}`;
      const res = await fetch(url);
      const data = await res.json();
      this.subscriptions = data.subscribers;
      this.loaded = true;
      this.loading = false;
    }
  }
});
