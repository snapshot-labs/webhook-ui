import { ref } from 'vue';
import clientEIP712 from '@/helpers/clientEIP712';
import { useWeb3 } from '@/composables/useWeb3';
import { useFlashNotification } from '@/composables/useFlashNotification';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';

export function useClient() {
  const { web3 } = useWeb3();
  const auth = getInstance();
  const { notify } = useFlashNotification();

  const isSending = ref(false);

  async function send(payload) {
    isSending.value = true;
    try {
      return await sendEIP712(payload);
    } catch (e: any) {
      return errorMessage(e);
    } finally {
      isSending.value = false;
    }
  }

  async function sendEIP712(payload) {
    try {
      if (payload.type === 'addSubscription') {
        return await clientEIP712.webhook(auth.web3, web3.value.account, {
          from: web3.value.account,
          space: payload.space,
          url: payload.url,
          active: 1
        });
      } else if (payload.type === 'removeSubscription') {
        return await clientEIP712.removeWebhook(auth.web3, web3.value.account, {
          from: web3.value.account,
          id: payload.id,
          active: 0
        });
      }
    } catch (e: any) {
      return errorMessage(e);
    }
  }

  function errorMessage(e: any) {
    const errorMessage =
      e?.error_description && typeof e.error_description === 'string'
        ? `Oops, ${e.error_description}`
        : 'Something went wrong';
    notify(['red', errorMessage]);
    return e;
  }

  return { send, isSending };
}
