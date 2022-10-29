import Client from '@snapshot-labs/snapshot.js/src/client';

const webhookUrl =
  import.meta.env.SNAPSHOT_WEBHOOK_API || 'http://localhost:3000';
const client = new Client(webhookUrl);

export default client;
