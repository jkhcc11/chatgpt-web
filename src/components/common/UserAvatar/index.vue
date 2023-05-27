<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NAvatar } from 'naive-ui'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import { fetchReource } from '@/api'
import type { UserInfo } from '@/store/modules/user/helper'

// const userStore = await useUserStore()

// const userInfo = computed(() => userStore.userInfo)

const loading = ref(false)
const userInfo = ref<UserInfo>()

async function fetchResource() {
  try {
    loading.value = true
    const { data } = await fetchReource<UserInfo>()
    userInfo.value = data
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchResource()
})
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
      <template v-if="isString(userInfo?.avatar) && userInfo.avatar.length > 0">
        <NAvatar
          size="large"
          round
          :src="userInfo.avatar"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ userInfo?.name ?? 'jkhcc11' }}
      </h2>
      <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span
          v-if="isString(userInfo?.description) && userInfo.description !== ''"
          v-html="userInfo.description"
        />
      </p>
    </div>
  </div>
</template>
