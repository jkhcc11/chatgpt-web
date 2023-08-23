<script  setup lang='ts'>
import type {
  DataTableColumns,
} from 'naive-ui'
import {
  NButton,
  NDataTable,
  NInput,
  NModal,
  NPagination,
  NSpace,
  NSpin,
} from 'naive-ui'

import { defineProps, onMounted, reactive, ref } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const props = defineProps({
  onInitData: {
    type: Function,
  },
  onCreateColumns: {
    type: Function,
  },
  loading: {
    type: Boolean,
  },
})

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'onCreate'): void
}

const showModal = ref(false)

// 移动端自适应相关
const { isMobile } = useBasicLayout()
const dataSource = ref([])
const tableLoading = ref(false)
const keyWordRef = ref('')

// 新增或创建
const onCreate = () => {
  showModal.value = !showModal.value
  emit('onCreate')
  // currentModel.value = mode
}

const pageSizes = [10, 20, 30]
const paginationReactive = reactive({
  page: 1,
  pageSize: pageSizes[0],
  showSizePicker: true,
  pageSizes,
  pageCount: 2,
  totalSize: 1,
  onChange: async (page: number) => {
    paginationReactive.page = page
    await initData({})
  },
  onUpdatePageSize: async (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    await initData({})
  },
})
const rowKey = (rowData: any):(number | string) => {
  return rowData.id
}

const columns = props.onCreateColumns() as DataTableColumns<any>

const initData = async (queryData: any) => {
  tableLoading.value = true
  // const reqData = await queryWebConfig<any>(data)
  if (queryData) {
    queryData.pageSize = paginationReactive.pageSize
    queryData.page = paginationReactive.page
  }
  else {
    queryData = {
      pageSize: paginationReactive.pageSize,
      page: paginationReactive.page,
    }
  }

  const reqData = await props.onInitData(queryData) as any
  dataSource.value = reqData.data?.items
  tableLoading.value = false
  paginationReactive.pageCount = Math.ceil(reqData.data?.total / paginationReactive.pageSize)
  paginationReactive.totalSize = reqData.data?.total
  // dataCountRef.value = reqData.data?.total
}

const inputChange = async (newVal: any) => {
  keyWordRef.value = newVal
  await initData({ keyWord: newVal })
}

onMounted(async () => {
  await initData({})
})

defineExpose({
  async onRefresh() {
    await initData({ keyWord: keyWordRef.value })
  },
  async closeDialog() {
    await initData({ keyWord: keyWordRef.value })
    showModal.value = false
  },
  showDialog() {
    showModal.value = true
  },
})
</script>

<template>
  <div
    class="flex gap-3 mb-4"
    :class="[isMobile ? 'flex-col' : 'flex-row justify-between']"
  >
    <div class="flex items-center space-x-4">
      <NButton
        type="primary"
        size="small"
        @click="onCreate()"
      >
        新增
      </NButton>
    </div>
    <div class="flex items-center">
      <NInput
        style="width: 100%"
        @change="inputChange"
      />
    </div>
  </div>
  <NDataTable
    :loading="tableLoading"
    :max-height="710"
    :columns="columns"
    :data="dataSource"
    :bordered="false"
    :row-key="rowKey"
  />

  <NSpace justify="end">
    <NPagination
      :page="paginationReactive?.page"
      :page-size="paginationReactive?.pageSize"
      :page-count="paginationReactive?.pageCount"
      :show-size-picker="paginationReactive?.showSizePicker"
      :page-sizes="paginationReactive?.pageSizes"
      @update:page="paginationReactive.onChange"
      @update:page-size="paginationReactive.onUpdatePageSize"
    >
      <template #prefix>
        共 {{ paginationReactive?.totalSize }} 条
      </template>
    </NPagination>
  </NSpace>

  <NModal v-model:show="showModal" style="width: 60%;" preset="card" title="操作">
    <NSpace vertical>
      <NSpin :show="loading">
        <slot name="showContent" />
      </NSpin>
    </NSpace>
  </NModal>
</template>
