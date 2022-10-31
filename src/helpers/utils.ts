import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import duration from 'dayjs/plugin/duration';
import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import { getUrl as snapshotGetUrl } from '@snapshot-labs/snapshot.js/src/utils';
import pkg from '@/../package.json';

const IPFS_GATEWAY: string =
  import.meta.env.VITE_IPFS_GATEWAY || 'https://cloudflare-ipfs.com';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(duration);

dayjs.updateLocale('en', {
  relativeTime: {
    future: '%s ago',
    past: '%s left',
    s: 'now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1m',
    MM: '%dm',
    y: '1y',
    yy: '%dy'
  }
});

export function getUrl(str: string) {
  return snapshotGetUrl(str, IPFS_GATEWAY);
}

export function shortenAddress(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shorten(str: string, key?: any): string {
  if (!str) return str;
  let limit;
  if (typeof key === 'number') limit = key;
  if (key === 'symbol') limit = 6;
  if (key === 'name') limit = 64;
  if (key === 'choice') limit = 12;
  if (limit)
    return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
  return shortenAddress(str);
}

export function explorerUrl(network, str: string, type = 'address'): string {
  if (network === 'starknet') type = 'contract';
  return `${networks[network].explorer}/${type}/${str}`;
}

export function _n(value) {
  const formatter = new Intl.NumberFormat('en', { notation: 'standard' });
  return formatter.format(value);
}

export function jsonParse(input, fallback?) {
  if (typeof input !== 'string') {
    return fallback || {};
  }
  try {
    return JSON.parse(input);
  } catch (err) {
    return fallback || {};
  }
}

export function lsSet(key: string, value: any) {
  return localStorage.setItem(`${pkg.name}.${key}`, JSON.stringify(value));
}

export function lsGet(key: string, fallback?: any) {
  const item = localStorage.getItem(`${pkg.name}.${key}`);
  return jsonParse(item, fallback);
}

export function lsRemove(key: string) {
  return localStorage.removeItem(`${pkg.name}.${key}`);
}

export function _d(s: number) {
  return dayjs
    .duration(s, 'seconds')
    .format('H[h] m[m] s[s]')
    .replace(/\b0+[a-z]+\s*/gi, '')
    .trim();
}

export function _t(number) {
  try {
    return dayjs(number * 1e3).format('MMM D, YYYY · h:mm A');
  } catch (e) {
    console.log(e);
    return '';
  }
}

export function _rt(number) {
  try {
    return dayjs(number * 1e3).toNow(false);
  } catch (e) {
    console.log(e);
    return '';
  }
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
