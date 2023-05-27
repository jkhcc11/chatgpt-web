<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NButton, NInput, NModal, useMessage } from 'naive-ui'
import { fetchReource, fetchVerify } from '@/api'
import { useAuthStore } from '@/store'
import Icon403 from '@/icons/403.vue'
import type { UserInfo } from '@/store/modules/user/helper'

interface Props {
  visible: boolean
}

defineProps<Props>()

const authStore = useAuthStore()
// const userStore = await useUserStore()

const ms = useMessage()

const loading = ref(false)
const token = ref('')

const disabled = computed(() => !token.value.trim() || loading.value)
// const userInfo = computed(() => userStore.userInfo)
const userInfo = ref<UserInfo>()

async function handleVerify() {
  const secretKey = token.value.trim()

  if (!secretKey)
    return

  try {
    loading.value = true
    await fetchVerify(secretKey)
    authStore.setToken(secretKey)
    ms.success('success')
    window.location.reload()
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    authStore.removeToken()
    token.value = ''
  }
  finally {
    loading.value = false
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleVerify()
  }
}

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
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            403
          </h2>
          <div class="text-base text-left text-slate-500 dark:text-slate-500">
            <abbr class="text-red-600">未授权，请输入卡密并确保卡密和模型匹配。</abbr> <br>
            免费gpt3卡密：<abbr class="text-blue-700">{{ userInfo?.freeCode }} </abbr>  (每日共享{{ userInfo?.everyDayFreeTimes }}次访问)<br>
            <div v-if="userInfo?.freeCode4">
              免费gpt4卡密：<abbr class="text-blue-700">{{ userInfo.freeCode4 }} </abbr>  (每日共享{{ userInfo?.everyDayFreeTimes4 }}次访问)
            </div>
            <abbr class="text-red-600">由于某些原因,请使用ai1-20(均可).gpt-666.com挨个切换</abbr>
            <br>
            <a :href="userInfo?.cardShopUrl" target="_blank" class="text-blue-500">购买卡密</a>
          </div>
          <Icon403 class="w-[200px] m-auto" />
        </header>
        <NInput v-model:value="token" type="password" placeholder="" @keypress="handlePress" />
        <NButton
          block
          type="primary"
          :disabled="disabled"
          :loading="loading"
          @click="handleVerify"
        >
          {{ $t('common.verify') }}
        </NButton>
      </div>
    </div>
  </NModal>
</template>
