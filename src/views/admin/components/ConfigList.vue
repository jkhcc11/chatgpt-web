<script setup lang="ts">
import type { DataTableColumns, FormInst, FormItemRule } from 'naive-ui'
import {
  NButton,
  NForm,
  NFormItemGi,
  NGrid,
  NInput,
  NInputNumber, NSelect, NTag, useDialog, useMessage,
} from 'naive-ui'

import { h, onMounted, ref } from 'vue'
import CommonQueryList from '@/components/common/CommonQueryList.vue'
import { deleteWebConfig, queryWebConfig, saveWebConfig } from '@/api'
import { allSupportModel } from '@/utils/consts'

interface WebConfigItem {
  subDomainHost: string | null
  description: string
  homeBtnHtml: string
  avatar: string | null
  name: string | null
  freeCode3: string | null
  freeCode4: string | null
  freeTimesWith3: number
  freeTimesWith4: number
  wximg: string | null
  wxremark: string | null
  supportModel: string[]
}

// 生成
const currentEditData = ref<WebConfigItem>({} as WebConfigItem)
const formRef = ref<FormInst | null>(null)
const formRules = {
  freeCode3: {
    required: true,
    trigger: ['blur', 'input'],
    message: '必填',
  },
  freeCode4: {
    required: true,
    trigger: ['blur', 'input'],
    message: '必填',
  },
  freeTimesWith3: {
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
  freeTimesWith4: {
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
const modelOptions = allSupportModel.map(
  v => ({
    label: v,
    value: v,
  }))

const queryRef = ref()
const message = useMessage()
const naiveDialog = useDialog()
const initData = async (data: any) => {
  return await queryWebConfig<any>(data)
}

// 编辑
const onDelete = async (rowData: any) => {
  naiveDialog.warning({
    title: '提示',
    content: '是否要删除该条数据？',
    positiveText: '删除',
    onPositiveClick: async () => {
      const reqResult = await deleteWebConfig<any>({ id: rowData.id })
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
  currentEditData.value = rowData
  queryRef.value?.showDialog()
}
const createColumns = (): DataTableColumns<any> => {
  return [
    {
      type: 'expand',
      renderExpand: (rowData) => {
        return h('div', {
          innerHTML: `<strong>左下角：</strong>${rowData.description}<br/> <strong>描述：</strong>${rowData.homeBtnHtml}`,
        })
      },
    },
    {
      title: '子域名',
      key: 'subDomainHost',
    },
    {
      title: '默认显示名',
      key: 'name',
    },
    {
      title: '头像',
      key: 'avatar',
    },
    {
      title: 'Free3',
      key: 'freeCode3',
    },
    {
      title: '3次数',
      key: 'freeTimesWith3',
    },
    {
      title: 'Free4',
      key: 'freeCode4',
    },
    {
      title: '4次数',
      key: 'freeTimesWith4',
    },
    {
      title: 'vx图',
      key: 'wximg',
    },
    {
      title: 'vx备注',
      key: 'wxremark',
    },
    {
      title: '支持模型',
      key: 'supportModel',
      width: 280,
      render(row) {
        return row.supportModel.map((it: any) => {
          return h(NTag, {
            type: 'info',
            size: 'small',
            class: 'ml-2',
          }, {
            default: () => it,
          })
        })
      },
    },
    {
      title: '创建时间',
      key: 'createdTime',
      width: 150,
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
          ),
          h(
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
      const reqResult = await saveWebConfig<any>(currentEditData.value)
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
  currentEditData.value = { } as WebConfigItem
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
          <NFormItemGi label="卡密3" path="freeCode3" :span="1">
            <NInput v-model:value="currentEditData.freeCode3" placeholder="gpt3免费卡密" />
          </NFormItemGi>
          <NFormItemGi label="卡密4" path="freeCode4" :span="1">
            <NInput v-model:value="currentEditData.freeCode4" placeholder="gpt4免费卡密" />
          </NFormItemGi>

          <NFormItemGi label="卡密3次数" path="freeTimesWith3" :span="1">
            <NInputNumber v-model:value="currentEditData.freeTimesWith3" :min="0" placeholder="gpt3免费次数，仅提示使用" />
          </NFormItemGi>
          <NFormItemGi label="卡密4次数" path="freeTimesWith4" :span="1">
            <NInputNumber v-model:value="currentEditData.freeTimesWith4" :min="0" placeholder="gpt4免费次数，仅提示使用" />
          </NFormItemGi>

          <NFormItemGi label="域名" path="subDomainHost" :span="2">
            <NInput v-model:value="currentEditData.subDomainHost" placeholder="为空 就是默认配置" />
          </NFormItemGi>
          <NFormItemGi label="左下名称" path="name" :span="2">
            <NInput v-model:value="currentEditData.name" placeholder="左下角名称" />
          </NFormItemGi>

          <NFormItemGi label="左下图备注" path="wxremark" :span="1">
            <NInput v-model:value="currentEditData.wxremark" placeholder="左下图备注" />
          </NFormItemGi>
          <NFormItemGi label="用户头像" path="avatar" :span="2">
            <NInput v-model:value="currentEditData.avatar" placeholder="用户头像" />
          </NFormItemGi>
          <NFormItemGi label="左下图" path="wximg" :span="1">
            <NInput v-model:value="currentEditData.wximg" placeholder="图片地址或相对路径" />
          </NFormItemGi>

          <NFormItemGi label="支持模型" path="supportModel" :span="4">
            <NSelect v-model:value="currentEditData.supportModel" :multiple="true" :clearable="true" placeholder="站点可选择的模型" :options="modelOptions" />
          </NFormItemGi>

          <NFormItemGi label="左下角配置" path="description" :span="4">
            <NInput v-model:value="currentEditData.description" type="textarea" placeholder="支持Html格式" />
          </NFormItemGi>
          <NFormItemGi label="提示语" path="homeBtnHtml" :span="4">
            <NInput v-model:value="currentEditData.homeBtnHtml" type="textarea" placeholder="首页Html格式" />
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
