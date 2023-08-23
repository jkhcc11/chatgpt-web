<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import { useDialog } from 'naive-ui'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'
import { useAuthStore } from '@/store'

const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))

const authStore = useAuthStore()
const naiveDialog = useDialog()
const show = ref(false)

function logout() {
  naiveDialog.warning({
    title: '提示',
    content: '是否确认退出？',
    positiveText: '确认',
    onPositiveClick: async () => {
      authStore.removeToken()
      window.location.reload()
    },
  })
}
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
    <div class="flex-1 flex-shrink-0 overflow-hidden">
      <UserAvatar />
    </div>

    <HoverButton @click="show = true">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>

    <HoverButton @click="logout">
      <span class="text-xl">
        <SvgIcon icon="ri:logout-box-r-line" />
      </span>
    </HoverButton>

    <Setting v-if="show" v-model:visible="show" />
  </footer>
</template>
