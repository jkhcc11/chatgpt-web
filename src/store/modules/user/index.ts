import { defineStore } from 'pinia'
import type { UserState } from './helper'
import { defaultSetting, getLocalReource } from './helper'

export const useUserStore = defineStore('local-reource-store', {
  state: (): UserState => defaultSetting(),
  actions: {
    async initApiConfig() {
      if (this.userInfo == null)
        this.userInfo = await getLocalReource()
    },
  },
})
