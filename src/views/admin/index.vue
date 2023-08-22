<script setup lang='ts'>
import { ref } from 'vue'
import { NCard, NGrid, NGridItem, NTabPane, NTabs } from 'naive-ui'
import CardNoList from './components/CardNoList.vue'
import CardTypeList from './components/CardTypeList.vue'
import ConfigList from './components/ConfigList.vue'

const active = ref('CardTypeList')
</script>

<template>
  <NGrid :cols="1" :y-gap="8" style="padding: 1%;">
    <NGridItem>
      <NCard title="管理端">
        <NTabs v-model:value="active" type="line" animated>
          <NTabPane name="CardNoList" tab="CardNoList">
            <template #tab>
              <span class="ml-2">卡密列表</span>
            </template>
            <div class="min-h-[100px]">
              <CardNoList />
            </div>
          </NTabPane>
          <NTabPane name="CardTypeList" tab="CardTypeList">
            <template #tab>
              <span class="ml-2">卡类型</span>
            </template>
            <div class="min-h-[100px]">
              <CardTypeList />
            </div>
          </NTabPane>
          <NTabPane name="ConfigList" tab="ConfigList">
            <template #tab>
              <span class="ml-2">站点配置</span>
            </template>
            <div class="min-h-[100px]">
              <ConfigList />
            </div>
          </NTabPane>
        </NTabs>
      </NCard>
    </NGridItem>
  </NGrid>
</template>
