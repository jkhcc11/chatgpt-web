<script setup lang="ts">
import type { DataTableColumns, FormInst, FormItemRule } from 'naive-ui'
import {
  NButton,
  NForm,
  NFormItemGi,
  NGrid,
  NInputNumber,
  NSelect, useDialog, useMessage,
} from 'naive-ui'

import { h, onMounted, ref } from 'vue'
import CommonQueryList from '@/components/common/CommonQueryList.vue'
import { createCardNo, deleteCardNo, queryCardNo } from '@/api'
import { getAllCardTypeCache } from '@/store/modules/cardType/helper'

// 生成
const currentEditData = ref({ number: 1 })
const cardTypeOptions = ref([])
const formRef = ref<FormInst | null>(null)
const formRules = {
  codeTypeId: {
    required: true,
    trigger: ['blur'],
    message: '请选择类型',
  },
  number: {
    required: true,
    trigger: ['blur', 'input'],
    message: '必填',
    validator(rule: FormItemRule, value: number) {
      if (!value
      || value <= 0)
        return new Error('必填')
      return true
    },
  },
} as FormItemRule | Array<FormItemRule>

const queryRef = ref()
const message = useMessage()
const naiveDialog = useDialog()
const initData = async (data: any) => {
  const reqData = await queryCardNo<any>(data)
  return reqData
}

const onDelete = async (rowData: any) => {
  naiveDialog.warning({
    title: '提示',
    content: '是否要删除该条数据？',
    positiveText: '删除',
    onPositiveClick: async () => {
      const reqResult = await deleteCardNo<any>({ id: rowData.id })
      if (reqResult.isSuccess) {
        message.success(reqResult.message)
        await queryRef.value?.onRefresh()
        return
      }

      message.error(reqResult.message)
    },
  })
}

const createColumns = (): DataTableColumns<any> => {
  return [
    {
      title: '卡密',
      key: 'cardNo',
    },
    {
      title: '类型',
      key: 'codeTypeName',
    },
    {
      title: '激活时间',
      key: 'activateTime',
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
      const reqResult = await createCardNo<any>(currentEditData.value)
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

const loadCardType = async () => {
  const allCache = await getAllCardTypeCache()
  cardTypeOptions.value = allCache.items.map((it: any) => {
    return {
      label: `${it.cardTypeName}--${it.validDays}`,
      value: it.id,
    }
  })
}

function onCreate() {
  currentEditData.value = { number: 1 }
}

onMounted(() => {
  loadCardType()
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
          <NFormItemGi label="卡类型" path="codeTypeId" :span="2">
            <NSelect v-model:value="currentEditData.codeTypeId" :filterable="true" :clearable="true" placeholder="选择卡类型" :options="cardTypeOptions" />
          </NFormItemGi>

          <NFormItemGi label="生成数量" path="number" :span="2">
            <NInputNumber v-model:value="currentEditData.number" :min="1" placeholder="生成数量 最大500" />
          </NFormItemGi>
        </NGrid>
      </NForm>

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
