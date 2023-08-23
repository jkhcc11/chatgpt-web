import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post, sendDelete } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/gpt-web-api/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/gpt-web-api/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      topP: settingStore.top_p,
      apiModel: settingStore.api_model,
    }
  }

  return post<T>({
    url: '/gpt-web-api/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/gpt-web-api/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/gpt-web-api/verify',
    data: { token },
  })
}

export function fetchReource<T>() {
  return post<T>({
    url: '/gpt-web-api/resource',
  })
}

// admin
export function queryWebConfig<T>(params: any) {
  return get<T>({
    url: '/config-v2/query-web-config',
    data: params,
  })
}
export function saveWebConfig<T>(data: any) {
  return post<T>({
    url: '/config-v2/create-update-web-config',
    data,
  })
}
export function deleteWebConfig<T>(params: any) {
  return sendDelete<T>({
    url: '/config-v2/delete-web-config',
    data: params,
  })
}

export function queryCardNo<T>(params: any) {
  return get<T>({
    url: '/config-v2/query-activation-code',
    data: params,
  })
}
export function createCardNo<T>(data: any) {
  return post<T>({
    url: '/config-v2/batch-create-activation-code',
    data,
  })
}
export function deleteCardNo<T>(params: any) {
  return sendDelete<T>({
    url: '/config-v2/delete-code',
    data: params,
  })
}

export function queryCardType<T>(params: any) {
  return get<T>({
    url: '/config-v2/query-card-type',
    data: params,
  })
}
export function createAndUpdateCardType<T>(data: any) {
  return post<T>({
    url: '/config-v2/create-update-card-type',
    data,
  })
}
export function deleteCardType<T>(params: any) {
  return sendDelete<T>({
    url: '/config-v2/delete-card-type',
    data: params,
  })
}
