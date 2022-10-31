import { defineStore } from 'pinia';
import apollo from '@/helpers/apollo';
import { SPACES_QUERY } from '@/helpers/queries';
import type { Space } from '@/types';

export const useSpacesStore = defineStore('spaces', {
  state: () => ({
    loading: false,
    loaded: false,
    spaces: [] as Space[]
  }),
  actions: {
    async fetchAll() {
      if (this.loading) return;
      this.loading = true;

      const { data } = await apollo.query({ query: SPACES_QUERY });
      this.spaces = data.spaces;
      this.spaces.unshift({ id: '*', name: 'All spaces', avatar: '' });
      this.loaded = true;
      this.loading = false;
    }
  }
});
