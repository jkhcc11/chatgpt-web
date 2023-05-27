<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui'
import { fetchChatConfig } from '@/api'
import pkg from '@/../package.json'

interface ConfigState {
  expiryTime?: string
  activedTime?: string
  canModelStr?: string
}

const loading = ref(false)
const config = ref<ConfigState>()

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <h2 class="text-xl font-bold">
        Version - {{ pkg.version }}
      </h2>
      <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
        <p>
          项目地址
          <a
            class="text-blue-600 dark:text-blue-500"
            href="https://github.com/jkhcc11/chatgpt-web"
            target="_blank"
          >
            Chatgpt-web
          </a>
        </p>
      </div>
      <p>激活时间：<b>{{ config?.activedTime ?? '-' }}</b></p>
      <p>到期时间：<b class="text-red-600">{{ config?.expiryTime ?? '-' }}</b></p>
      <p>可用模型：<b class="text-blue-600">{{ config?.canModelStr ?? 'gpt3' }}</b></p>
    </div>
  </NSpin>
</template>
