import { ref, computed } from 'vue';
import client from '@/helpers/client';
import clientGnosisSafe from '@/helpers/clientGnosisSafe';
import clientEIP712 from '@/helpers/clientEIP712';
import { useWeb3 } from '@/composables/useWeb3';
import { useFlashNotification } from '@/composables/useFlashNotification';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';

export function useClient() {
  const { web3 } = useWeb3();
  const auth = getInstance();
  const { notify } = useFlashNotification();

  const isSending = ref(false);

  const connectorName = computed(() => auth.provider.value?.connectorName);

  const isGnosisSafe = computed(
    () =>
      web3.value?.walletConnectType === 'Gnosis Safe Multisig' ||
      connectorName.value === 'gnosis'
  );

  const usePersonalSign = computed(() => isGnosisSafe.value);

  async function send(payload) {
    isSending.value = true;
    try {
      if (usePersonalSign.value) {
        if (payload.proposal) payload.proposal = payload.proposal.id;
        const clientPersonalSign = isGnosisSafe.value
          ? clientGnosisSafe
          : client;
        return await clientPersonalSign.broadcast(
          auth.web3,
          web3.value.account,
          payload.space,
          payload.type,
          payload
        );
      }
      await sendEIP712(payload);
      return webhook(payload);
    } catch (e: any) {
      const errorMessage =
        e?.error_description && typeof e.error_description === 'string'
          ? `Oops, ${e.error_description}`
          : 'Something went wrong';
      notify(['red', errorMessage]);
      return e;
    } finally {
      isSending.value = false;
    }
  }

  async function webhook(payload) {
    const active = payload.type === 'addSubscription' ? 1 : 0;
    const params = {
      owner: web3.value.account,
      space: payload.space,
      url: payload.url,
      active: active,
      created: payload.timestamp
    };
    const snapshotWebhookApi = process.env.SNAPHOT_WEBHOOK_URL ?? 'http://localhost:3000/api';
    const url = `${snapshotWebhookApi}/subscriptions`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'text/html', 'Content-Type': 'application/json' },
      body: JSON.stringify({ params })
    });

    return res.json();
  }

  async function sendEIP712(payload) {
    try {
      if (payload.type === 'addSubscription') {
        await clientEIP712.webhook(auth.web3, web3.value.account, {
          from: web3.value.account,
          space: payload.space,
          url: payload.url,
          active: 1
        });
      } else if (payload.type === 'removeSubscription') {
        await clientEIP712.webhook(auth.web3, web3.value.account, {
          from: web3.value.account,
          space: payload.space,
          url: payload.url,
          active: 0
        });
      }
    } catch (e: any) {
      const errorMessage =
        e?.error_description && typeof e.error_description === 'string'
          ? `Oops, ${e.error_description}`
          : 'Something went wrong';
      notify(['red', errorMessage]);
      return e;
    }
  }

  return { send, isSending, isGnosisSafe };
}
