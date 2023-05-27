<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NButton, NInput, NSelect, NSlider, NSpin, useMessage } from 'naive-ui'
import { useSettingStore } from '@/store'
import type { SettingsState } from '@/store/modules/settings/helper'
import { t } from '@/locales'
import type { UserInfo } from '@/store/modules/user/helper'
import { getLocalReource } from '@/store/modules/user/helper'

const settingStore = useSettingStore()

const ms = useMessage()

const systemMessage = ref(settingStore.systemMessage ?? '')

const temperature = ref(settingStore.temperature ?? 0.5)

const top_p = ref(settingStore.top_p ?? 1)
const api_model = ref(settingStore.api_model ?? 'gpt-3.5-turbo')

const userInfo = ref<UserInfo | null>()
const loading = ref(false)

// 多模型
const modelOptions = ref()

function updateSettings(options: Partial<SettingsState>) {
  settingStore.updateSetting(options)
  ms.success(t('common.success'))
}

function handleReset() {
  settingStore.resetSetting()
  ms.success(t('common.success'))
  window.location.reload()
}

async function fetchResource() {
  try {
    loading.value = true
    const data = await getLocalReource()
    modelOptions.value = data?.supportModel

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
  <NSpin :show="loading">
    <div class="p-4 space-y-5 min-h-[200px]">
      <div class="space-y-6">
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[120px]">{{ $t('setting.role') }}</span>
          <div class="flex-1">
            <NInput v-model:value="systemMessage" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" />
          </div>
          <NButton size="tiny" text type="primary" @click="updateSettings({ systemMessage })">
            {{ $t('common.save') }}
          </NButton>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[120px]">{{ $t('setting.temperature') }} </span>
          <div class="flex-1">
            <NSlider v-model:value="temperature" :max="1" :min="0" :step="0.1" />
          </div>
          <span>{{ temperature }}</span>
          <NButton size="tiny" text type="primary" @click="updateSettings({ temperature })">
            {{ $t('common.save') }}
          </NButton>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[120px]">{{ $t('setting.top_p') }} </span>
          <div class="flex-1">
            <NSlider v-model:value="top_p" :max="1" :min="0" :step="0.1" />
          </div>
          <span>{{ top_p }}</span>
          <NButton size="tiny" text type="primary" @click="updateSettings({ top_p })">
            {{ $t('common.save') }}
          </NButton>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[120px]">模型</span>
          <div class="flex-1">
            <NSelect
              v-model:value="api_model"
              :options="modelOptions"
            />
          </div>
          <NButton size="tiny" text type="primary" @click="updateSettings({ api_model })">
            {{ $t('common.save') }}
          </NButton>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex-shrink-0 w-[120px]">&nbsp;</span>
          <NButton size="small" @click="handleReset">
            {{ $t('common.reset') }}
          </NButton>
        </div>
      </div>
    </div>
  </NSpin>
</template>
