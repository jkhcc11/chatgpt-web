<script setup lang="ts">
import type { DataTableColumns, FormInst, FormItemRule } from 'naive-ui'
import {
  NButton,
  NDataTable,
  NForm,
  NFormItemGi,
  NGrid,
  NInput,
  NInputNumber, NSelect, NSwitch, NTag, useDialog, useMessage,
} from 'naive-ui'

import { h, onMounted, ref } from 'vue'
import CommonQueryList from '@/components/common/CommonQueryList.vue'
import { createAndUpdateCardType, deleteCardType, queryCardType } from '@/api'
import { supportModelGroupNames } from '@/utils/consts'

// 生成
const currentEditData = ref({
  id: null,
  cardTypeName: '',
  supportModelGroupNameItems: [],
  validDays: 1,
  isEveryDayResetCount: false,
})
const supportModelGroupNameOptions = supportModelGroupNames.map((it: any) => {
  return {
    label: it,
    value: it,
  }
})
const formRef = ref<FormInst | null>(null)
const formRules = {
  cardTypeName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入名称',
  },
  supportModelGroupNameItems: {
    required: true,
    trigger: ['blur'],
    message: '请选择',
    validator(rule: FormItemRule, value: any[]) {
      if (!value
      || value.length <= 0)
        return new Error('请选择')
      return true
    },
  },
} as FormItemRule | Array<FormItemRule>

const queryRef = ref()
const message = useMessage()
const naiveDialog = useDialog()
const initData = async (data: any) => {
  const reqData = await queryCardType<any>(data)
  return reqData
}

// 编辑
const limitItems = ref<any[]>([])
function onEditRemove(rowData: any) {
  const index = limitItems.value.indexOf(rowData)
  if (index !== -1)
    limitItems.value.splice(index)
}
function onAddLimit() {
  if (limitItems.value.length + 1 > supportModelGroupNames.length) {
    message.warning('新增失败,不能超过模型组个数')
    return
  }

  limitItems.value.push({})
}
const createEditColumns = (): DataTableColumns<any> => {
  return [
    {
      title: '模型组名',
      key: 'supportModelGroupName',
      width: 180,
      render: (rowData: any) => {
        return h(NSelect, {
          options: supportModelGroupNameOptions,
          value: rowData.supportModelGroupName,
          onUpdateValue: (newVal: string) => {
            rowData.supportModelGroupName = newVal
          },
        })
      },
    },
    {
      title: '限制次数',
      key: 'everyDayTimes',
      render: (rowData: any) => {
        return h(NInputNumber, {
          value: rowData.everyDayTimes,
          min: 1,
          placeholder: '重置或连续的最大次数',
          onUpdateValue: (newVal: any) => {
            rowData.everyDayTimes = newVal
          },
        })
      },
    },
    {
      title: '历史会话',
      key: 'maxHistoryCount',
      render: (rowData: any) => {
        return h(NInputNumber, {
          value: rowData.maxHistoryCount,
          min: 0,
          placeholder: '最大历史会话',
          onUpdateValue: (newVal: any) => {
            rowData.maxHistoryCount = newVal
          },
        })
      },
    },
    {
      title: '最大请求Tokens',
      key: 'maxRequestTokens',
      render: (rowData: any) => {
        return h(NInputNumber, {
          value: rowData.maxRequestTokens,
          min: 0,
          placeholder: '最大请求Tokens',
          onUpdateValue: (newVal: any) => {
            rowData.maxRequestTokens = newVal
          },
        })
      },
    },
    {
      title: '最大返回Tokens',
      key: 'maxResponseTokens',
      render: (rowData: any) => {
        return h(NInputNumber, {
          value: rowData.maxResponseTokens,
          min: 0,
          placeholder: '最大返回Tokens',
          onUpdateValue: (newVal: any) => {
            rowData.maxResponseTokens = newVal
          },
        })
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 130,
      align: 'center',
      render(row) {
        return h('div', { class: 'flex items-center gap-2' }, {
          default: () => [h(
            NButton,
            {
              tertiary: true,
              size: 'small',
              type: 'error',
              onClick: () => onEditRemove(row),
            },
            { default: () => '移除' },
          ),
          ],
        })
      },
    },
  ]
}

const onDelete = async (rowData: any) => {
  naiveDialog.warning({
    title: '提示',
    content: '是否要删除该条数据？',
    positiveText: '删除',
    onPositiveClick: async () => {
      const reqResult = await deleteCardType<any>({ id: rowData.id })
      if (reqResult.isSuccess) {
        message.success(reqResult.message)
        await queryRef.value?.onRefresh()
        return
      }

      message.error(reqResult.message)
    },
  })
}

function onEdit(rowData: any) {
  currentEditData.value.cardTypeName = rowData.cardTypeName
  currentEditData.value.isEveryDayResetCount = rowData.isEveryDayResetCount
  currentEditData.value.id = rowData.id
  currentEditData.value.validDays = rowData.validDays
  limitItems.value = rowData.maxCountItems.map((it: any) => {
    return {
      supportModelGroupName: it.modeGroupName,
      everyDayTimes: it.maxCount,
      maxHistoryCount: it.maxHistoryCount,
      maxRequestTokens: it.maxRequestToken,
      maxResponseTokens: it.maxResponseToken,
    }
  })
  currentEditData.value.supportModelGroupNameItems = Array.from(new Set(rowData.supportModelItems.map((it: any) => {
    return it.modeGroupName
  })))

  queryRef.value?.showDialog()
}
const createColumns = (): DataTableColumns<any> => {
  return [
    {
      type: 'expand',
      renderExpand: (rowData) => {
        return h('div', {
          innerHTML: `<strong>限制信息：</strong>${JSON.stringify(rowData.maxCountItems)}`,
        })
      },
    },
    {
      title: '类型名',
      key: 'cardTypeName',
    },
    {
      title: '支持系统',
      key: 'supportChatSystemType',
      render: (rowData: any) => {
        return rowData.supportChatSystemType === 1 ? 'OpenAi' : '其他'
      },
    },
    {
      title: '有效天数',
      key: 'validDays',
    },
    {
      title: '每天重置统计',
      key: 'isEveryDayResetCount',
      render: (rowData: any) => {
        return h(NTag, {
          type: rowData.isEveryDayResetCount ? 'info' : 'success',
        }, {
          default: () => rowData.isEveryDayResetCount ? '是' : '否',
        })
      },
    },

    // {
    //   title: '最大请求次数',
    //   key: 'maxCountItems',
    // },
    {
      title: '支持模型',
      key: 'supportModel',
      render: (rowData: any) => {
        return rowData.supportModelItems.map((it: any) => {
          return it.modeId
        }).map((it: any) => {
          return h(NTag, {
            type: 'info',
            size: 'small',
            // style: 'margin-left: 3px;',
            class: 'ml-1',
          }, {
            default: () => it,
          })
        })
      },
    },
    {
      title: '创建时间',
      key: 'createdTime',
    },
    {
      title: '操作',
      key: 'actions',
      width: 130,
      align: 'center',
      render(row) {
        return h('div', { class: 'flex items-center gap-2' }, {
          default: () => [h(
            NButton,
            {
              tertiary: true,
              size: 'small',
              type: 'info',
              onClick: () => onEdit(row),
            },
            { default: () => '编辑' },
          ), h(
            NButton,
            {
              tertiary: true,
              size: 'small',
              type: 'error',
              onClick: () => onDelete(row),
            },
            { default: () => '删除' },
          ),
          ],
        })
      },
    },
  ]
}

// 保存
const onSave = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (!limitItems.value || limitItems.value.length === 0) {
        message.error('请添加限制条件')
        return
      }

      const pd = {
        ...currentEditData.value,
        limitItems: limitItems.value,
      }

      const reqResult = await createAndUpdateCardType<any>(pd)
      if (reqResult.isSuccess) {
        await queryRef.value?.closeDialog()
        message.success(reqResult.message)
        return
      }

      message.error(reqResult.message)
      // console.log('form', currentEditData.value)
    }
  })
}

function onCreate() {
  currentEditData.value = {
    id: null,
    cardTypeName: '',
    supportModelGroupNameItems: [],
    validDays: 1,
    isEveryDayResetCount: false,
  }
  limitItems.value = []
}

onMounted(() => {
})
</script>

<template>
  <CommonQueryList
    ref="queryRef" :on-init-data="initData"
    :on-create-columns="createColumns"
    @on-create="onCreate"
  >
    <template #showContent>
      <NForm ref="formRef" :model="currentEditData" :rules="formRules">
        <NGrid :x-gap="8" :y-gap="4" :cols="4">
          <NFormItemGi label="类型名" path="cardTypeName" :span="2">
            <NInput v-model:value="currentEditData.cardTypeName" placeholder="卡类型名" :maxlength="12" />
          </NFormItemGi>

          <NFormItemGi label="模型组" path="supportModelGroupNameItems" :span="2">
            <NSelect
              v-model:value="currentEditData.supportModelGroupNameItems" :multiple="true"
              placeholder="支持模型组" :options="supportModelGroupNameOptions"
            />
          </NFormItemGi>

          <NFormItemGi label="有效天数" path="validDays" :span="2">
            <NInputNumber v-model:value="currentEditData.validDays" :min="1" placeholder="卡的有效天数" />
          </NFormItemGi>

          <NFormItemGi label="每天重置统计" path="isEveryDayResetCount" :span="2">
            <NSwitch v-model:value="currentEditData.isEveryDayResetCount">
              <template #checked>
                重置
              </template>
              <template #unchecked>
                累计
              </template>
            </NSwitch>
          </NFormItemGi>
        </NGrid>
      </NForm>

      <NButton
        size="small"
        strong secondary
        type="info"
        @click="onAddLimit"
      >
        新增
      </NButton>
      <NDataTable
        :loading="false"
        :min-height="150"
        :columns="createEditColumns()"
        :data="limitItems"
        :bordered="false"
      />

      <NButton
        block
        type="primary"
        @click="onSave"
      >
        确认
      </NButton>
    </template>
  </CommonQueryList>
</template>
