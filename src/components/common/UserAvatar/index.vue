<script setup lang='ts'>
import { NAvatar } from 'naive-ui'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import { useUserStore } from '@/store'

const userStore = useUserStore()
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
      <template v-if="isString(userStore.userInfo?.avatar) && userStore.userInfo.avatar.length > 0">
        <NAvatar
          size="large"
          round
          :src="userStore.userInfo.avatar"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ userStore.userInfo?.name ?? 'jkhcc11' }}
      </h2>
      <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span
          v-if="isString(userStore.userInfo?.description) && userStore.userInfo.description !== ''"
          v-html="userStore.userInfo.description"
        />
      </p>
    </div>
  </div>
</template>
